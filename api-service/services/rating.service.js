const { Op } = require('sequelize');
const { pick, keys } = require('lodash');
const { Rating, RatingRecord, Listing, Product } = require('../models');

/**
 * Get Ratings by account id.
 *
 * @param uuid accountId
 * @param string marketplaceId
 * @param object query
 * @returns object
 */
const getRatingsByAccountId = async (accountId, query) => {
  const { filter, pageSize: limit, pageOffset: offset, sort } = query;

  let options = {
    attributes: {
      exclude: ['breakdown', 'createdAt', 'updatedAt'],
    },
    include: {
      model: Listing,
      as: 'listing',
      required: true,
      attributes: ['asin', 'title', 'thumbnail'],
      where: {
        ...pick(filter, keys(Listing.rawAttributes)),
        ...pick(filter.listing, keys(Listing.rawAttributes)),
      },
      include: {
        model: Product,
        required: true,
        as: 'product',
        attributes: [],
        where: {
          accountId,
        },
      },
    },
    limit,
    offset,
    order: sort,
  };

  if (query.search) {
    options.include.where[Op.or] = ['asin', 'title'].map((attribute) => {
      return {
        [attribute]: {
          [Op.iLike]: `%${query.search}%`,
        },
      };
    });
  }

  const ratings = await Rating.findAndCountAll(options);

  return ratings;
};

/**
 * Get Rating by account id and asin.
 *
 * @param uuid accountId
 * @param string asin
 * @param object query
 * @returns Rating
 */
const getRatingByAccountIdAndAsin = async (accountId, asin, query) => {
  const { marketplaceId, include } = query;
  let options = {
    include: [
      {
        model: Listing,
        as: 'listing',
        required: true,
        attributes: ['asin', 'title', 'thumbnail'],
        where: {
          asin,
          marketplaceId,
        },
        include: {
          model: Product,
          required: true,
          as: 'product',
          attributes: [],
          where: {
            accountId,
          },
        },
      },
    ],
  };

  if (include === 'records') {
    options.include.push({
      model: RatingRecord,
      as: 'records',
    });
  }

  const rating = await Rating.findOne(options);

  return rating;
};

module.exports = {
  getRatingsByAccountId,
  getRatingByAccountIdAndAsin,
};
