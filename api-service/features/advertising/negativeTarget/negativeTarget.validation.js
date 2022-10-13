const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@features/base/base.validation');

const listNegativeTargetsRequests = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    campaignType: Joi.string()
      .required()
      .valid('sponsoredProducts', 'sponsoredBrands', 'sponsoredDisplay'),
    expressionType: Joi.string().valid('auto', 'manual'),
    state: Joi.string().valid('enabled', 'paused', 'archived'),
    include: Joi.array().items(Joi.string().valid('adGroup')).default([]),
  }),
};

module.exports = {
  listNegativeTargetsRequests,
};
