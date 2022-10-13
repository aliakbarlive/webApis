const { keys } = require('lodash');
const { AdvKeyword, AdvKeywordRecord } = require('../models');

exports.AdvKeyword = AdvKeyword;
exports.advKeywordModel = AdvKeyword;
exports.advKeywordRecordModel = AdvKeywordRecord;

exports.advKeywordAttributes = keys(AdvKeyword.rawAttributes);

/**
 * Find and count all AdvKeyword
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvKeyword = async (options) => {
  const { rows, count } = await AdvKeyword.findAndCountAll(options);

  return { rows, count };
};

/**
 * Find AdvKeyword by primary key.
 *
 * @param object options
 * @returns AdvKeyword
 */
exports.findAdvKeywordByPk = async (options) => {
  const advKeyword = await AdvKeyword.findByPk(options);

  return advKeyword;
};

/**
 * Find all AdvKeyword
 *
 * @param object options
 * @returns array
 */
exports.findAllAdvKeyword = async (options) => {
  const advKeywords = await AdvKeyword.findAll(options);

  return advKeywords;
};

/**
 * Count AdvKeyword
 *
 * @param object options
 * @returns number
 */
exports.countAdvKeywords = async (options) => {
  const count = await AdvKeyword.count(options);

  return count;
};

/**
 * Check if advKeyword exists.
 *
 * @param object options
 * @returns boolean
 */
exports.checkAdvKeywordExists = async (options) => {
  const count = await this.countAdvKeywords(options);

  return !!count;
};
