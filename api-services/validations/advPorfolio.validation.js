const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('./base.validation');

const getAdvPortfoliosRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    state: Joi.string().valid('enabled', 'paused', 'archived'),
  }),
};

module.exports = {
  getAdvPortfoliosRequest,
};
