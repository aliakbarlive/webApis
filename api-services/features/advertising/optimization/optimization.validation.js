const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@validations/base.validation');

const { requiresCampaignType } = require('@validations/advertising.validation');

const listOptimizations = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresCampaignType,
    ...listBaseValidation,
    optimizableId: Joi.number(),
    optimizableType: Joi.string(),
  }),
};

module.exports = {
  listOptimizations,
};
