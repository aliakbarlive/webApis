const { keys } = require('lodash');
const { AdvCampaignNegativeKeyword } = require('../models');

exports.AdvCampaignNegativeKeyword = AdvCampaignNegativeKeyword;

exports.advCampaignNegativeKeywordAttributes = keys(
  AdvCampaignNegativeKeyword.rawAttributes
);

/**
 * Find and count all AdvCampaignNegativeKeyword
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvCampaignNegativeKeyword = async (options) => {
  const { rows, count } = await AdvCampaignNegativeKeyword.findAndCountAll(
    options
  );

  return { rows, count };
};

/**
 * Find and count all AdvCampaignNegativeKeyword
 *
 * @param object options
 * @returns array
 */
exports.findAllAdvCampaignNegativeKeyword = async (options) => {
  const campaignNegativeKeywords = await AdvCampaignNegativeKeyword.findAll(
    options
  );

  return campaignNegativeKeywords;
};

/**
 * Create AdvCampaignNegativeKeyword.
 *
 * @param object data
 * @returns AdvCampaignNegativeKeyword
 */
exports.createAdvCampaignNegativeKeyword = async (data) => {
  const advCampaignNegativeKeyword = await AdvCampaignNegativeKeyword.create(
    data
  );

  return advCampaignNegativeKeyword;
};

/**
 * Bulk create AdvCampaignNegativeKeyword.
 *
 * @param object data
 * @returns array AdvCampaignNegativeKeyword
 */
exports.bulkCreateAdvCampaignNegativeKeyword = async (data, options = {}) => {
  const advCampaignNegativeKeywords =
    await AdvCampaignNegativeKeyword.bulkCreate(data, options);

  return advCampaignNegativeKeywords;
};
