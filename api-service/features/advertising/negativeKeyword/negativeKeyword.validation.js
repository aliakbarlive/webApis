const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@features/base/base.validation');

const listNegativeKeywordsRequests = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    campaignType: Joi.string()
      .required()
      .valid('sponsoredProducts', 'sponsoredBrands', 'sponsoredDisplay'),
    matchType: Joi.string().valid('negativeExact', 'negativePhrase'),
    state: Joi.string().valid('enabled', 'paused', 'archived'),
    include: Joi.array().items(Joi.string().valid('adGroup')).default([]),
  }),
};

module.exports = {
  listNegativeKeywordsRequests,
};
