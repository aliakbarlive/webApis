const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('./base.validation');

const getProductListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    status: Joi.string().valid('Active', 'Inactive'),
  }),
};

const getGroupedProductListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
  }),
};

const getProductRequest = {
  params: Joi.object().keys({
    asin: Joi.string().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

module.exports = {
  getProductRequest,
  getProductListRequest,
  getGroupedProductListRequest,
};
