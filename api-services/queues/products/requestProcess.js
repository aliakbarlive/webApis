const axios = require('axios');
const {
  Product,
  SyncRecord,
  Listing,
  Marketplace,
  SyncReport,
} = require('../../models');

const { syncReportService } = require('../../features/dataSync/syncReport');

const requestProcess = async (job, done) => {
  const { accountId, syncType } = job.data;
  const baseUri = 'https://api.rainforestapi.com';
  const apiKey = process.env.RAINFOREST_API_KEY;

  try {
    const syncRecord = await SyncRecord.create({
      accountId,
      pendingReports: 1,
      totalReports: 1,
      syncType,
      dataType: 'products',
      status: 'STARTED',
      syncDate: Date.now(),
    });

    const syncReport = await SyncReport.create({
      syncRecordId: syncRecord.syncRecordId,
      status: 'REQUESTING',
    });

    const payload = {
      name: `${accountId}-products`,
      enabled: true,
      schedule_type: 'manual',
      priority: 'normal',
      notification_webhook: `${process.env.RAINFOREST_TUNNEL_URL}/v1/products/collection/receive`,
      notification_email: process.env.RAINFOREST_NOTIFICATION_EMAIL,
      notification_as_json: true,
    };

    const collectionRes = await axios.post(
      `${baseUri}/collections?api_key=${apiKey}`,
      payload
    );

    const { collection } = collectionRes.data;

    await syncReport.update({ referenceId: collection.id });

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

    // request collection for products
    const requests = products.map((product) => {
      return {
        type: 'product',
        amazon_domain: product.domainName,
        asin: product.asin,
        custom_id: product.listingId,
        include_a_plus_body: 'true',
        language: 'en_US',
      };
    });

    await axios.put(
      `${baseUri}/collections/${collection.id}?api_key=${apiKey}`,
      { requests }
    );

    await axios.get(`${baseUri}/collections/${collection.id}/start`, {
      params: { api_key: apiKey },
    });

    await syncReportService.markSyncReportAsRequestedById(
      syncReport.syncReportId,
      {
        message: 'Generating collections.',
      }
    );

    done(null, {
      name: collection.name,
      id: collection.id,
    });

    // return resolve({
    //   name: collection.name,
    //   id: collection.id,
    // });
  } catch (error) {
    // console.log(error);
    done(new Error(error));
  }
};

module.exports = requestProcess;
