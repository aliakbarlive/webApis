const Joi = require('joi');

const {
  metricFilterValidations,
  attributesValidation,
} = require('../advertising.validation');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@features/base/base.validation');

const listProductsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    ...metricFilterValidations(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    attributes: attributesValidation(['asin', 'sku'], ['asin', 'sku']),
    advAdGroupId: Joi.number(),
    advCampaignIds: Joi.array().items(Joi.number()).default([]),
    advPortfolioIds: Joi.array().items(Joi.number()).default([]),
    campaignType: Joi.string()
      .required()
      .valid('sponsoredProducts', 'sponsoredBrands', 'sponsoredDisplay'),
    include: Joi.array()
      .items(Joi.string().valid('previousData', 'listing'))
      .default([]),
  }),
};

module.exports = {
  listProductsRequest,
};
