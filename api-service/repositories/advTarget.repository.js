const { keys } = require('lodash');
const { AdvTarget, AdvTargetRecord } = require('../models');

exports.AdvTarget = AdvTarget;
exports.AdvTargetRecord = AdvTargetRecord;

exports.advTargetAttributes = keys(AdvTarget.rawAttributes);

/**
 * Find and count all AdvTarget
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvTarget = async (options) => {
  const { rows, count } = await AdvTarget.findAndCountAll(options);

  return { rows, count };
};

/**
 * Find AdvTarget by primary key.
 *
 * @param object options
 * @returns AdvTarget
 */
exports.findAdvTargetByPk = async (options) => {
  const advTarget = await AdvTarget.findByPk(options);

  return advTarget;
};

/**
 * Find all AdvTarget
 *
 * @param object options
 * @returns array
 */
exports.findAllAdvTarget = async (options) => {
  const advTargets = await AdvTarget.findAll(options);

  return advTargets;
};

/**
 * Count AdvTarget
 *
 * @param object options
 * @returns number
 */
exports.countAdvTargets = async (options) => {
  const count = await AdvTarget.count(options);

  return count;
};

/**
 * Check if AdvTarget exists.
 *
 * @param object options
 * @returns boolean
 */
exports.checkAdvTargetExists = async (options) => {
  const count = await this.countAdvTargets(options);

  return !!count;
};
