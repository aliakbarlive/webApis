const axios = require('axios');
const moment = require('moment');
const { Review, Listing, SpReport, SyncRecord } = require('../../models');

module.exports = async function (job, done) {
  const { pages } = job.data;

  const { syncRecordId } = await SpReport.findByPk(job.data.spReportId);
  const { syncType } = await SyncRecord.findByPk(syncRecordId);

  try {
    await Promise.all(
      pages.map(async (page) => {
        const res = await axios.get(page);
        const { data } = res;
        const requestDay =
          syncType == 'initial'
            ? moment.utc(moment().subtract(7, 'days')).format()
            : moment.utc(moment().subtract(2, 'days')).format();

        await Promise.all(
          data.map(async (p) => {
            if (p.success) {
              const listingId = p.result.request_parameters.custom_id.replace(
                '-REVIEWS',
                ''
              );
              const { reviews, summary } = p.result;
              await reviews.forEach(async (review) => {
                const {
                  id: reviewId,
                  title,
                  body,
                  link,
                  rating,
                  date: { utc: reviewDate },
                  profile: {
                    name: profileName,
                    link: profileLink,
                    id: profileId,
                  },
                } = review;

                const { asin, marketplaceId } = await Listing.findByPk(
                  listingId
                );

                if (review.date.utc > requestDay) {
                  await Review.upsert({
                    reviewId,
                    listingId,
                    asin,
                    marketplaceId,
                    title,
                    body,
                    link,
                    rating,
                    reviewDate,
                    profileName,
                    profileLink,
                    profileId,
                  });
                }
              });
              //Save reviewTotal to Listing row
              const listing = await Listing.findByPk(listingId);
              await listing.update({
                reviewsTotal: summary.reviews_total ?? 0,
              });
            } else {
              console.log(`Sync failed for ${p.request.asin}`);
            }
            return p;
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
