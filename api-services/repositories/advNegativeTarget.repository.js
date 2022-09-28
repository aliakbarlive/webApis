const { keys } = require('lodash');
const { AdvNegativeTarget } = require('../models');

exports.advNegativeTargetAttributes = keys(AdvNegativeTarget.rawAttributes);

/**
 * Find and count all AdvNegativeTarget
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvNegativeTarget = async (options) => {
  const { rows, count } = await AdvNegativeTarget.findAndCountAll(options);

  return { rows, count };
};

/**
 * Find all AdvNegativeTarget
 *
 * @param object options
 * @returns object
 */
exports.findAllAdvNegativeTarget = async (options) => {
  const advNegativeTargets = await AdvNegativeTarget.findAll(options);

  return advNegativeTargets;
};

/**
 * Bulk create AdvNegativeTarget.
 *
 * @param object data
 * @returns array AdvNegativeTarget
 */
exports.bulkCreateAdvNegativeTarget = async (data, options = {}) => {
  const advCampaignNegativeTargets = await AdvNegativeTarget.bulkCreate(
    data,
    options
  );

  return advCampaignNegativeTargets;
};
