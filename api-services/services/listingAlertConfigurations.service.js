const { pick, keys } = require('lodash');
const { ListingAlertConfiguration, Listing, Product } = require('../models');

/**
 * Get Listing Alert Config Summary by AccountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getListingAlertConfigSummaryByAccountId = async (accountId, query) => {
  let enabledAlerts = 0;

  const { count, rows } = await ListingAlertConfiguration.findAndCountAll({
    where: { status: true },
    attributes: [
      'title',
      'description',
      'price',
      'featureBullets',
      'listingImages',
      'buyboxWinner',
      'categories',
      'reviews',
      'lowStock',
      'rating',
    ],
    include: {
      model: Listing,
      as: 'listing',
      required: true,
      attributes: [],
      where: pick(query, keys(ListingAlertConfiguration.rawAttributes)),
      include: {
        model: Product,
        required: true,
        as: 'product',
        attributes: [],
        where: { accountId },
      },
    },
  });

  if (count) {
    rows.forEach((row) => {
      const enabledAlert = Object.keys(row.toJSON()).filter((key) => row[key]);

      enabledAlerts = enabledAlerts + enabledAlert.length;
    });
  }

  return {
    monitoredProducts: count,
    enabledAlerts,
  };
};

/**
 * Get Listing Alert Configurations by accountId and marketplaceId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getListingAlertConfigsByAccountId = async (accountId, query) => {
  const { filter, pageSize: limit, pageOffset: offset, sort } = query;

  const configs = await ListingAlertConfiguration.findAndCountAll({
    where: pick(filter, keys(ListingAlertConfiguration.rawAttributes)),
    include: {
      model: Listing,
      as: 'listing',
      attributes: ['asin', 'title', 'thumbnail'],
      required: true,
      where: { marketplaceId: filter.marketplaceId, status: 'Active' },
      include: {
        model: Product,
        required: true,
        as: 'product',
        attributes: [],
        where: { accountId },
      },
    },
    order: sort,
    limit,
    offset,
  });

  return configs;
};

/**
 * Get lising alert configuration by id.
 *
 * @param uuid accountId
 * @param int listingAlertConfigurationId
 * @param object query
 * @returns ListingAlertConfiguration
 */
const getListingAlertConfigByAccountIdAndConfigId = async (
  accountId,
  listingAlertConfigurationId,
  query
) => {
  const config = await ListingAlertConfiguration.findOne({
    where: {
      listingAlertConfigurationId,
    },
    include: {
      model: Listing,
      as: 'listing',
      attributes: [],
      required: true,
      where: pick(query, keys(Listing.rawAttributes)),
      include: {
        model: Product,
        required: true,
        as: 'product',
        attributes: [],
        where: { accountId },
      },
    },
  });

  return config;
};

/**
 * Update listing alert configuration
 *
 * @param ListingAlertConfiguration listingAlertConfiguration
 * @param object data
 * @returns ListingAlertConfiguration
 */
const updateListingAlertConfiguration = async (
  listingAlertConfiguration,
  data
) => {
  const updatedConfig = await listingAlertConfiguration.update(data);

  return updatedConfig;
};

module.exports = {
  updateListingAlertConfiguration,
  getListingAlertConfigsByAccountId,
  getListingAlertConfigSummaryByAccountId,
  getListingAlertConfigByAccountIdAndConfigId,
};
