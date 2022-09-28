const { keys } = require('lodash');
const { AdvPortfolio } = require('../models');

exports.advAdGroupModel = AdvPortfolio;

exports.advPortfolioAttributes = keys(AdvPortfolio.rawAttributes);

/**
 * Find and count all AdvPortfolio
 *
 * @param object options
 * @returns object
 */
exports.findAndCountAllAdvPortfolio = async (options) => {
  const { rows, count } = await AdvPortfolio.findAndCountAll(options);

  return { rows, count };
};

/**
 * Find all AdvPortfolio
 *
 * @param object options
 * @returns object
 */
exports.findAllAdvPortfolio = async (options) => {
  const advPorfolios = await AdvPortfolio.findAll(options);

  return advPorfolios;
};

exports.bulkCreateAdvPorfolio = async (records, options) => {
  return await AdvPortfolio.bulkCreate(records, options);
};
