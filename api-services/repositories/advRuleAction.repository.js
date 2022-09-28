const { keys } = require('lodash');
const { AdvRuleAction } = require('../models');

exports.advRuleActionAttributes = keys(AdvRuleAction.rawAttributes);

/**
 * Find and count all AdvNegativeKeyword
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvRuleAction = async (options) => {
  const { rows, count } = await AdvRuleAction.findAndCountAll(options);

  return { rows, count };
};

exports.findAllAdvRuleAction = async (options) => {
  const rules = await AdvRuleAction.findAll(options);

  return rules;
};
