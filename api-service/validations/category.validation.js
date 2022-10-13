const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('./base.validation');

const getCategoryListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    include: Joi.string().valid('records'),
    asin: Joi.string(),
  }),
};

const getCategoryRequest = {
  params: Joi.object().keys({
    categoryId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    include: Joi.string().valid('records'),
  }),
};

module.exports = {
  getCategoryRequest,
  getCategoryListRequest,
};
