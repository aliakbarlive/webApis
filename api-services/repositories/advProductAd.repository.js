const { keys } = require('lodash');
const { AdvProductAd, AdvProductAdRecord } = require('../models');

exports.AdvProductAd = AdvProductAd;
exports.AdvProductAdRecord = AdvProductAdRecord;

exports.advProductAdAttributes = keys(AdvProductAd.rawAttributes);

/**
 * Find and count all AdvProductAd
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvProductAd = async (options) => {
  const { rows, count } = await AdvProductAd.findAndCountAll(options);

  return { rows, count };
};

/**
 * Find AdvProductAd by primary key.
 *
 * @param object options
 * @returns AdvProductAd
 */
exports.findAdvProductAdByPk = async (options) => {
  const advProductAd = await AdvProductAd.findByPk(options);

  return advProductAd;
};

/**
 * Find all AdvProductAd
 *
 * @param object options
 * @returns array
 */
exports.findAllAdvProductAd = async (options) => {
  const advProductAds = await AdvProductAd.findAll(options);

  return advProductAds;
};

/**
 * Count AdvProductAd
 *
 * @param object options
 * @returns number
 */
exports.countAdvProductAds = async (options) => {
  const count = await AdvProductAd.count(options);

  return count;
};

/**
 * Check if advProductAd exists.
 *
 * @param object options
 * @returns boolean
 */
exports.checkAdvProductAdExists = async (options) => {
  const count = await this.countAdvProductAds(options);

  return !!count;
};

/**
 * Bulk create AdvProductAd.
 *
 * @param object data
 * @returns array AdvProductAd
 */
exports.bulkCreateAdvProductAd = async (data, options = {}) => {
  const advCampaignNegativeKeywords = await AdvProductAd.bulkCreate(
    data,
    options
  );

  return advCampaignNegativeKeywords;
};
