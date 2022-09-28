const axios = require('axios');
const {
  Account,
  Rating,
  RatingRecord,
  CategoryRanking,
  CategoryRankingRecord,
  Listing,
  Marketplace,
  Product,
} = require('../../models');
const _ = require('lodash');

module.exports = async function (job, done) {
  const { pages } = job.data;
  try {
    await Promise.all(
      pages.map(async (page) => {
        const res = await axios.get(page);
        const { data } = res;

        await Promise.all(
          data.map(async (p) => {
            try {
              if (p.success) {
                const { asin, amazon_domain } = p.request;
                const { marketplaceId } = await Marketplace.findOne({
                  where: { domainName: `www.${amazon_domain}` },
                });

                const rec = await Listing.findOne({
                  where: { asin, marketplaceId },
                });

                if ('product' in p.result) {
                  const { product } = p.result;

                  const hasDescription =
                    product.a_plus_content &&
                    product.a_plus_content.has_a_plus_content &&
                    product.a_plus_content.body
                      ? product.a_plus_content.body
                      : 'description' in product
                      ? product.description
                      : null;

                  const hasFeatureBullets =
                    'feature_bullets' in product
                      ? product.feature_bullets
                      : null;
                  const hasBuyboxWinner =
                    'buybox_winner' in product &&
                    'fulfillment' in product.buybox_winner &&
                    'third_party_seller' in product.buybox_winner.fulfillment &&
                    'name' in
                      product.buybox_winner.fulfillment.third_party_seller
                      ? product.buybox_winner.fulfillment.third_party_seller
                          .name
                      : null;

                  //save product ratings
                  await saveRatings(product, rec);
                  //save product ranking
                  await saveRankings(product, rec);

                  await rec.update({
                    title: product.title,
                    link: product.link,
                    description: hasDescription
                      ? hasDescription
                          .replace('data-src', 'data-temporary')
                          .replace('src', 'data-placeholder')
                          .replace('data-temporary', 'src')
                      : hasDescription,
                    status: 'Active',
                    featureBullets: hasFeatureBullets,
                    listingImages: product.images,
                    categories: product.categories,
                    buyboxWinner: hasBuyboxWinner,
                    parent_asin: product.parent_asin,
                    groupedAsin: product.parent_asin
                      ? product.parent_asin
                      : product.asin,
                    brand: product.brand,
                    keywords: product.keywords,
                  });

                  if (product.parent_asin) {
                    const productNotParent = await Product.findByPk(asin);

                    productNotParent.update({
                      parent: false,
                    });

                    await Product.findOrCreate({
                      where: {
                        asin: product.parent_asin,
                      },
                      defaults: {
                        accountId: productNotParent.accountId,
                        parent: true,
                        listing: false,
                      },
                    });
                  }
                } else {
                  rec.status = 'Inactive';
                  rec.save();
                }
              } else {
                //create + sync collection of failed requests?
                console.log(`Sync failed for ${p.request.asin}`);
              }
              return p;
            } catch (err) {
              console.log(err, ':err');
            }
          })
        );

        return page;
      })
    );

    return done(null, {});
  } catch (err) {
    return done(err);
  }
};

const saveRatings = async (product, listing) => {
  const { listingId, asin } = listing;

  let rating = await Rating.findOne({
    where: { listingId },
  });

  if (rating) {
    if (
      parseFloat(rating.overallRating) !== parseFloat(product.rating) ||
      !_.isEqual(rating.breakdown, product.rating_breakdown) ||
      parseInt(rating.ratingsTotal) !== parseInt(product.ratings_total)
    ) {
      await RatingRecord.create({
        listingId,
        asin,
        overallRating: rating.overallRating,
        breakdown: rating.breakdown,
        ratingsTotal: rating.ratingsTotal,
        ratingDate: rating.updatedAt,
      });
    }
  }

  if (
    'rating' in product ||
    'ratings_total' in product ||
    'rating_breakdown' in product
  ) {
    const fields = {
      listingId,
      overallRating: product.rating,
      breakdown: product.rating_breakdown,
      ratingsTotal: product.ratings_total,
    };

    if (!rating) {
      await Rating.create(fields);
      return;
    }

    const prevOverallRating = rating.overallRating;
    rating = await rating.update(fields);

    if (prevOverallRating != rating.overallRating) {
      const alertConfiguration = await listing.getAlertConfiguration();
      const product = await listing.getProduct({
        include: {
          model: Account,
        },
      });

      if (alertConfiguration) {
        const { listingId, marketplaceId, asin } = listing;
        const { status, ratingCondition } = alertConfiguration;
        const { type, value } = ratingCondition;
        const { overallRating } = rating;
        const sendAlert =
          type === 'below' ? value > overallRating : value < overallRating;

        if (status && alertConfiguration.rating && sendAlert) {
          await product.Account.sendAlertToUsers({
            listingId,
            marketplaceId,
            type: 'rating',
            title: `Your current rating for your product ${asin} is ${type} ${value}, Rating is now at ${overallRating}.`,
            data: {
              alertable: {
                type: 'Rating',
                where: {
                  listingId,
                },
              },
            },
          });
        }
      }
    }
  }
};

const saveRankings = async (product, rec) => {
  if (product.bestsellers_rank) {
    const { listingId } = rec;
    const { bestsellers_rank } = product;

    await bestsellers_rank.forEach(async (ranking) => {
      const { category, rank, link } = ranking;

      const categoryRanking = await CategoryRanking.findOne({
        where: { listingId, category },
      });

      if (categoryRanking) {
        if (rank !== categoryRanking.rank) {
          await CategoryRankingRecord.create({
            categoryRankingId: categoryRanking.categoryRankingId,
            rank: categoryRanking.rank,
            rankDate: categoryRanking.updatedAt,
          });

          categoryRanking.update({ rank });
        }
      } else {
        await CategoryRanking.create({
          listingId,
          // asin,
          category,
          rank,
          link,
        });
      }
    });
  }
};
