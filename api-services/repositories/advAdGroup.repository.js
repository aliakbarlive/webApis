const { keys } = require('lodash');
const { AdvAdGroup, AdvAdGroupRecord } = require('../models');

exports.advAdGroupModel = AdvAdGroup;
exports.AdvAdGroup = AdvAdGroup;
exports.AdvAdGroupRecord = AdvAdGroupRecord;

exports.advAdGroupAttributes = keys(AdvAdGroup.rawAttributes);

/**
 * Find and count all AdvAdGroup
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvAdGroup = async (options) => {
  const { rows, count } = await AdvAdGroup.findAndCountAll(options);

  return { rows, count };
};

/**
 * Count AdvAdGroup
 *
 * @param object options
 * @returns number
 */
exports.countAdvAdGroups = async (options) => {
  const count = await AdvAdGroup.count(options);

  return count;
};

/**
 * Check if advCampaign exists.
 *
 * @param object options
 * @returns boolean
 */
exports.checkAdvAdGroupExists = async (options) => {
  const count = await this.countAdvAdGroups(options);

  return !!count;
};
