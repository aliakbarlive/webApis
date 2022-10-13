const { keys } = require('lodash');
const { AdvNegativeKeyword } = require('../models');

exports.AdvNegativeKeyword = AdvNegativeKeyword;
exports.advNegativeKeywordAttributes = keys(AdvNegativeKeyword.rawAttributes);

/**
 * Find and count all AdvNegativeKeyword
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvNegativeKeyword = async (options) => {
  const { rows, count } = await AdvNegativeKeyword.findAndCountAll(options);

  return { rows, count };
};

/**
 * Find all AdvNegativeKeyword
 *
 * @param object options
 * @returns array advNegativeKeywords
 */
exports.findAllAdvNegativeKeyword = async (options) => {
  const advNegativeKeywords = await AdvNegativeKeyword.findAll(options);

  return advNegativeKeywords;
};

/**
 * Create AdvNegativeKeyword.
 *
 * @param object data
 * @returns AdvNegativeKeyword
 */
exports.createAdvNegativeKeyword = async (data) => {
  const advCampaignNegativeKeyword = await AdvNegativeKeyword.create(data);

  return advCampaignNegativeKeyword;
};

/**
 * Bulk create AdvNegativeKeyword.
 *
 * @param object data
 * @returns array AdvNegativeKeyword
 */
exports.bulkCreateAdvNegativeKeyword = async (data, options = {}) => {
  const advCampaignNegativeKeywords = await AdvNegativeKeyword.bulkCreate(
    data,
    options
  );

  return advCampaignNegativeKeywords;
};
