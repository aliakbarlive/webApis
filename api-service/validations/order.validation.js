const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
  requiresDateRange,
} = require('./base.validation');

const ordersBaseValidation = {
  withNotes: Joi.boolean(),
  asin: Joi.string(),
  fulfillmentChannel: Joi.string().custom((value) => {
    const isValid = value
      .split(',')
      .every((attribute) => ['AFN', 'MFN'].includes(attribute));

    if (!isValid) throw new Error('Invalid status.');

    return value;
  }),
  orderStatus: Joi.string().custom((value) => {
    const allowed = [
      'Pending',
      'Unshipped',
      'Shipping',
      'Shipped',
      'Delivered',
      'Returned',
      'Cancelled',
    ];

    const isValid = value
      .split(',')
      .every((attribute) => allowed.includes(attribute));

    if (!isValid) throw new Error('Invalid status.');

    return value;
  }),
};

const getOrderListRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...listBaseValidation,
    ...requiresDateRange,
    ...ordersBaseValidation,
  }),
};

const getOrdersSummaryRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    ...ordersBaseValidation,
    search: Joi.string().empty(''),
  }),
};

const getOrdersCountPerStateRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    ...ordersBaseValidation,
    search: Joi.string().empty(''),
  }),
};

const getOrderRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

module.exports = {
  getOrderRequest,
  getOrderListRequest,
  getOrdersSummaryRequest,
  getOrdersCountPerStateRequest,
};
