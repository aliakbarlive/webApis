const axios = require('axios');
const {
  Product,
  Marketplace,
  SyncRecord,
  SpReport,
  Listing,
} = require('../../models');

const requestProcess = async (job) => {
  return new Promise(async (resolve, reject) => {
    const { accountId, syncType } = job.data;
    const baseUri = 'https://api.rainforestapi.com';
    const apiKey = process.env.RAINFOREST_API_KEY;

    try {
      const syncRecord = await SyncRecord.create({
        accountId,
        pendingReports: 1,
        totalReports: 1,
        syncType,
        dataType: 'reviews',
        status: 'STARTED',
        syncDate: Date.now(),
      });

      const payload = {
        name: `${accountId}-reviews`,
        enabled: true,
        schedule_type: 'manual',
        priority: 'normal',
        notification_webhook: `${process.env.RAINFOREST_TUNNEL_URL}/v1/reviews/receive`,
        notification_email: process.env.RAINFOREST_NOTIFICATION_EMAIL,
        notification_as_json: true,
      };

      const collectionRes = await axios.post(
        `${baseUri}/collections?api_key=${apiKey}`,
        payload
      );

      const { collection } = collectionRes.data;

      const spReport = await SpReport.create({
        syncRecordId: syncRecord.syncRecordId,
        status: 'REQUESTED',
        reportId: collection.id,
      });

      // Get all products to request
      const marketplace = await Marketplace.findAll();
      const domainNames = marketplace.map((rec) => {
        rec.domainName = rec.domainName.split('.');
        rec.domainName.shift();
        return {
          salesChannel: rec.domainName.join('.'),
          marketplaceId: rec.marketplaceId,
        };
      });

      const productListings = await Product.findAll({
        where: { accountId, listing: true },
        include: [
          {
            model: Listing,
            as: 'listings',
            attributes: ['asin', 'marketplaceId', 'listingId'],
            where: {
              status: 'Active',
            },
          },
        ],
        attributes: [],
      });

      const products = productListings
        .map((rec) => {
          return rec.listings.map((listing) => {
            return {
              domainName: domainNames.find(
                (el) => el.marketplaceId === listing.marketplaceId
              ).salesChannel,
              asin: listing.asin,
              marketplaceId: listing.marketplaceId,
              listingId: listing.listingId,
            };
          });
        })
        .flat();

      const requests = products.map((product) => {
        return {
          type: 'reviews',
          amazon_domain: product.domainName,
          asin: product.asin,
          custom_id: `${product.listingId}-REVIEWS`,
          language: 'en_US',
          reviewer_type: 'all',
          review_stars: 'all_stars',
          review_formats: 'all_formats',
          review_media_type: 'all_reviews',
          sort_by: 'most_recent',
          output: 'json',
          include_html: 'false',
          global_reviews: 'false',
        };
      });

      await axios.put(
        `${baseUri}/collections/${collection.id}?api_key=${apiKey}`,
        { requests }
      );

      await axios.get(`${baseUri}/collections/${collection.id}/start`, {
        params: { api_key: apiKey },
      });

      await spReport.update({
        status: 'REQUESTED',
        message: `Generating collections.`,
      });

      await syncRecord.markAs('REQUESTED');

      return resolve({
        name: collection.name,
        id: collection.id,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = requestProcess;
