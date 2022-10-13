const { keys } = require('lodash');
const { AdvRule } = require('../models');

exports.advRuleAttributes = keys(AdvRule.rawAttributes);

/**
 * Find and count all AdvNegativeKeyword
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvRule = async (options) => {
  const { rows, count } = await AdvRule.findAndCountAll(options);

  return { rows, count };
};

exports.findAllAdvRule = async (options) => {
  const rules = await AdvRule.findAll(options);

  return rules;
};

exports.findAdvRuleByPk = async (advRuleId, options) => {
  const rule = await AdvRule.findByPk(advRuleId, options);

  return rule;
};

exports.createAdvRule = async (data) => {
  return await AdvRule.create(data);
};

exports.findOneAdvRule = async (options) => {
  return await AdvRule.findOne(options);
};

exports.updateAdvRule = async (advRule, data) => {
  return await advRule.update(data);
};
