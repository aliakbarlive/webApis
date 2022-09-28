const { pick, keys } = require('lodash');
const { Listing, Product, SpReport, SyncReport } = require('../models');

/**
 * Get grouped products associated to accountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getGroupedProductsByAccountId = async (accountId, query) => {
  let { filter, pageSize: limit, pageOffset: offset, sort } = query;

  const products = await Product.findAndCountAll({
    where: {
      accountId,
      parent: true,
    },
    attributes: ['asin'],
    include: {
      model: Listing,
      as: 'listingChild',
      where: pick(filter, keys(Listing.rawAttributes)),
      attributes: [
        'listingId',
        'asin',
        'groupedAsin',
        'title',
        'link',
        'brand',
        'status',
        'thumbnail',
      ],
    },
    order: sort,
    limit,
    offset,
  });

  return products;
};

const getProductByAccountIdAndAsin = async (accountId, asin, query = {}) => {
  const product = await Product.findOne({
    where: {
      asin,
      accountId,
      ...pick(query, keys(Product.rawAttributes)),
    },
  });

  return product;
};

/**
 * Add Job to save products via queue.
 *
 * @param object body
 */
const addJobToSaveProductsQueue = async (body) => {
  const { download_links } = body.result_set;
  const { id: reportId } = body.collection;
  const { collection } = body;

  try {
    if (body.request_info.success) {
      const syncReport = await SyncReport.findOne({
        where: { referenceId: reportId },
      });

      const saveProductsQueue = require('../queues/products/save');
      const accountId = collection.name.replace('-products', '');
      const { pages } = download_links.json;

      const job = await saveProductsQueue.add({
        pages,
        accountId,
        reportId,
        syncReportId: syncReport.syncReportId,
      });

      await syncReport.update({ jobId: job.id });
    }
  } catch (err) {
    console.log('Failed to add to save products queue.', err);
  }
};

module.exports = {
  addJobToSaveProductsQueue,
  getGroupedProductsByAccountId,
  getProductByAccountIdAndAsin,
};
