const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('./base.validation');

const getListingAlertConfigsSummaryRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

const getListingAlertConfigsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    status: Joi.boolean(),
    title: Joi.boolean(),
    description: Joi.boolean(),
    price: Joi.boolean(),
    featureBullets: Joi.boolean(),
    listingImages: Joi.boolean(),
    buyboxWinner: Joi.boolean(),
    categories: Joi.boolean(),
    reviews: Joi.boolean(),
    lowStock: Joi.boolean(),
    rating: Joi.boolean(),
  }),
};

const updateListingAlertConfigRequest = {
  params: Joi.object().keys({
    listingAlertConfigurationId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    status: Joi.boolean().required(),
    title: Joi.boolean().required(),
    description: Joi.boolean().required(),
    price: Joi.boolean().required(),
    featureBullets: Joi.boolean().required(),
    listingImages: Joi.boolean().required(),
    buyboxWinner: Joi.boolean().required(),
    categories: Joi.boolean().required(),
    reviews: Joi.boolean().required(),
    lowStock: Joi.boolean().required(),
    rating: Joi.boolean().required(),
    lowStockThreshold: Joi.number().required(),
    ratingCondition: Joi.object().keys({
      type: Joi.string().required().allow('below', 'above'),
      value: Joi.number().required(),
    }),
  }),
};

module.exports = {
  getListingAlertConfigsRequest,
  updateListingAlertConfigRequest,
  getListingAlertConfigsSummaryRequest,
};
