const { keys } = require('lodash');

const {
  AdvCampaign,
  AdvCampaignRecord,
  AdvCampaignBudgetRecommendation,
} = require('../models');

exports.advCampaignModel = AdvCampaign;
exports.AdvCampaign = AdvCampaign;
exports.AdvCampaignRecord = AdvCampaignRecord;
exports.AdvCampaignBudgetRecommendation = AdvCampaignBudgetRecommendation;

exports.advCampaignAttributes = keys(AdvCampaign.rawAttributes);

/**
 * Find and count all AdvCampaign
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvCampaign = async (options) => {
  const { rows, count } = await AdvCampaign.findAndCountAll(options);

  return { rows, count };
};

/**
 * Count AdvCampaign
 *
 * @param object options
 * @returns number
 */
exports.countAdvCampaigns = async (options) => {
  const count = await AdvCampaign.count(options);

  return count;
};

/**
 * Check if advCampaign exists.
 *
 * @param object options
 * @returns boolean
 */
exports.checkAdvCampaignExists = async (options) => {
  const count = await this.countAdvCampaigns(options);

  return !!count;
};
