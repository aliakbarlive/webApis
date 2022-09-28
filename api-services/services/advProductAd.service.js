const { Op } = require('sequelize');
const { pick, keys } = require('lodash');
const { Listing, Product, InventoryItem, AdvProfile } = require('../models');
const moment = require('moment');

const {
  AdvCampaign,
  advCampaignAttributes,
} = require('../repositories/advCampaign.repository');

const { AdvAdGroup } = require('../repositories/advAdGroup.repository');

const {
  AdvProductAd,
  AdvProductAdRecord,
  advProductAdAttributes,
  findAllAdvProductAd,
  bulkCreateAdvProductAd,
} = require('../repositories/advProductAd.repository');

const {
  generatePrevOptions,
  generatePrevDateRange,
  transformAdvertisingListQuery,
} = require('./advertising.service');

const {
  saveChanges,
  checkIfChangesAlreadySaved,
} = require('./advChangeCollection.service');

const { paginate } = require('./pagination.service');

/**
 * Get list of advProductAds associated to advProfileId
 *
 * @param {bigint} advProfileId
 * @param {objec} query
 * @returns {object} list
 */
const getAdvProductAds = async (
  advProfileId,
  query,
  raw = true,
  withImages = false
) => {
  const {
    filter,
    pageSize: limit = null,
    pageOffset: offset = null,
    include,
  } = query;
  const { attributes, sort, having, dateRange } =
    await transformAdvertisingListQuery(query);

  let options = {
    attributes,
    subQuery: false,
    where: pick(filter, advProductAdAttributes),
    group: ['AdvProductAd.asin', 'AdvProductAd.sku'],
    include: [
      {
        model: AdvProductAdRecord,
        as: 'records',
        attributes: [],
        where: dateRange,
        required: false,
      },
      {
        model: AdvAdGroup,
        attributes: [],
        right: true,
        required: true,
        include: [
          {
            model: AdvCampaign,
            attributes: [],
            right: true,
            where: {
              advProfileId,
              ...pick(filter, advCampaignAttributes),
            },
          },
        ],
      },
    ],
    raw,
    order: sort,
    having,
    offset,
    limit,
  };

  if (query.search) {
    options.where = {
      ...options.where,
      [Op.or]: [
        { asin: { [Op.iLike]: `%${query.search}%` } },
        { sku: { [Op.iLike]: `%${query.search}%` } },
      ],
    };
  }

  let { rows, count } = await AdvProductAd.findAndCountAll(options);

  rows = rows.map((row, index) => {
    return { ...row, index, listing: {} };
  });

  if (include && include.includes('previousData')) {
    const prevDateRange = generatePrevDateRange(query.dateRange);
    let prevOptions = generatePrevOptions(options, rows, prevDateRange, 'sku');

    prevOptions = {
      ...prevOptions,
      where: {
        [Op.or]: rows.map((row) => {
          return { asin: row.asin, sku: row.sku };
        }),
      },
      attributes,
      group: ['AdvProductAd.asin', 'AdvProductAd.sku'],
      raw: true,
    };

    const productAds = await AdvProductAd.findAll(prevOptions);

    rows = rows.map((row) => {
      return {
        ...row,
        previousData: productAds.find(
          (productAd) =>
            productAd.asin === row.asin && productAd.sku === row.sku
        ),
      };
    });
  }

  if (withImages && count) {
    const { accountId, marketplaceId } = await AdvProfile.findByPk(
      advProfileId
    );

    let inventoryWhereOptions = { accountId, marketplaceId, [Op.or]: [] };

    const skus = rows.filter((row) => row.sku).map((row) => row.sku);
    const asins = rows.filter((row) => row.asin).map((row) => row.asin);

    if (skus.length) {
      inventoryWhereOptions[Symbol.for('or')].push({
        sellerSku: { [Op.in]: skus },
      });
    }

    if (asins.length) {
      inventoryWhereOptions[Symbol.for('or')].push({
        asin: { [Op.in]: asins },
      });
    }

    const inventories = await InventoryItem.findAll({
      attributes: ['asin', 'sellerSku'],
      where: inventoryWhereOptions,
      include: {
        model: Listing,
        attributes: ['thumbnail', 'title'],
      },
    });

    rows = rows.map((row) => {
      const inventory = inventories.find(
        ({ asin, sellerSku }) => asin === row.asin || sellerSku === row.sku
      );

      if (inventory) {
        row.listing = {
          sku: inventory.sellerSku,
          asin: inventory.asin,
          title: inventory.Listing.title,
          thumbnail: inventory.Listing.thumbnail,
        };
      }

      return row;
    });
  }

  return { rows, count: count.length };
};

const getAdvProductAdsGroupByAdGroup = async (advProfileId, query) => {
  const { filter, pageSize: limit, pageOffset: offset, page } = query;

  let options = {
    subQuery: false,
    attributes: ['advAdGroupId', 'asin', 'sku'],
    raw: true,
    limit,
    offset,
    include: [
      {
        model: AdvAdGroup,
        attributes: ['advCampaignId'],
        right: true,
        required: true,
        include: [
          {
            model: AdvCampaign,
            attributes: [],
            right: true,
            where: {
              advProfileId,
              ...pick(filter, advCampaignAttributes),
            },
          },
        ],
      },
      {
        model: Product,
        attributes: [],
        include: {
          model: Listing,
          as: 'listings',
          attributes: ['thumbnail', 'title'],
          where: pick(filter, keys(Listing.rawAttributes)),
        },
      },
    ],
  };

  if (query.search) {
    options.where = {
      ...options.where,
      [Op.or]: [
        { asin: { [Op.iLike]: `%${query.search}%` } },
        { sku: { [Op.iLike]: `%${query.search}%` } },
      ],
    };
  }

  const { rows, count } = await AdvProductAd.findAndCountAll(options);

  return paginate(rows, count, page, offset, limit);
};

const getAdvProductAdsByIds = async (advProductAdIds) => {
  const advProductAds = await findAllAdvProductAd({
    where: {
      advProductAdId: { [Op.in]: advProductAdIds },
    },
    order: [['updatedAt', 'DESC']],
  });

  return advProductAds;
};

/**
 * Bulk Sync AdvProducAds.
 *
 * @param bigint advProfileId
 * @param string campaignType
 * @param array productAds
 * @param uuid userId
 * @param boolean saveLogs
 * @param AdvOptimization optimization
 */
const bulkSyncAdvProductAds = async (
  advProfileId,
  campaignType,
  productAds,
  userId = null,
  saveLogs = true,
  optimization = null
) => {
  if (!productAds.length) return;
  let recentlyUpdatedProductAds = [];
  let recentlyUpdatedProductAdsIds = [];

  const records = productAds.map((productAd) => {
    let obj = {
      ...productAd,
      advAdGroupId: productAd.adGroupId,
      advProductAdId: productAd.adId,
      syncAt: new Date(),
    };

    if ('creationDate' in productAd && 'lastUpdatedDate' in productAd) {
      obj.createdAt = new Date(productAd.creationDate);
      obj.updatedAt = new Date(productAd.lastUpdatedDate);
    }

    return pick(obj, advProductAdAttributes);
  });

  if (saveLogs) {
    recentlyUpdatedProductAdsIds = records
      .filter((record) => record.updatedAt)
      .map((r) => r.advProductAdId);

    if (recentlyUpdatedProductAdsIds.length) {
      recentlyUpdatedProductAds = await getAdvProductAdsByIds(
        recentlyUpdatedProductAdsIds
      );
    }
  }

  await bulkCreateAdvProductAd(records, {
    updateOnDuplicate: advProductAdAttributes.filter(
      (attr) => attr in records[0]
    ),
  });

  if (saveLogs && recentlyUpdatedProductAdsIds.length) {
    const newlyUpdatedProductAds = await getAdvProductAdsByIds(
      recentlyUpdatedProductAdsIds
    );

    for (const newData of newlyUpdatedProductAds) {
      const { advProductAdId, advAdGroupId, updatedAt } = newData;
      const advCampaignId = productAds.find(
        (p) => p.adId.toString() === advProductAdId.toString()
      ).campaignId;

      const saved = await checkIfChangesAlreadySaved({
        advProductAdId,
        recordType: 'productAd',
        activityDate: updatedAt,
      });

      let advOptimizationBatchId = null;
      let activityDate = updatedAt;

      if (optimization) {
        advOptimizationBatchId = optimization.batch.advOptimizationBatchId;
        activityDate = optimization.batch.processedAt;
      }

      if (!saved) {
        await saveChanges(
          advProfileId,
          campaignType,
          activityDate,
          userId,
          advOptimizationBatchId,
          {
            advProductAdId,
            advAdGroupId,
            advCampaignId,
            recordType: 'productAd',
            activityDate: updatedAt,
            previousData: recentlyUpdatedProductAds.find(
              (a) => a.advProductAdId === advProductAdId
            ),
            advOptimizationId: optimization
              ? optimization.advOptimizationId
              : null,
            newData,
          }
        );
      }
    }
  }
};

module.exports = {
  getAdvProductAds,
  getAdvProductAdsGroupByAdGroup,
  bulkSyncAdvProductAds,
};
