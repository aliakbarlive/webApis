const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('./base.validation');

const getInventoryListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    include: Joi.string().valid('details', 'costs'),
    status: Joi.string().valid('Active', 'Inactive'),
  }),
};

const getInventoryCostListRequest = {
  params: Joi.object().keys({
    inventoryItemId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...listBaseValidation,
    sort: Joi.string().default('startDate:asc'),
  }),
};

const addInventoryCostRequest = {
  params: Joi.object().keys({
    inventoryItemId: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      ...requiresAccountAndMarketplace,
      cogsAmount: Joi.number(),
      shippingAmount: Joi.number(),
      miscAmount: Joi.number(),
      startDate: Joi.date()
        .min('1900-01-01')
        .max('3000-01-01')
        .default('1900-01-01'),
    })
    .or('cogsAmount', 'shippingAmount', 'miscAmount'),
};

const updateInventoryRequest = {
  params: Joi.object().keys({
    inventoryItemId: Joi.number().required(),
  }),
};

const updateInventoryCostRequest = {
  params: Joi.object().keys({
    inventoryItemId: Joi.number().required(),
    productCostId: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      ...requiresAccountAndMarketplace,
      cogsAmount: Joi.number(),
      shippingAmount: Joi.number(),
      miscAmount: Joi.number(),
      startDate: Joi.date()
        .min('1900-01-01')
        .max('3000-01-01')
        .default('1900-01-01'),
    })
    .or('cogsAmount', 'shippingAmount', 'miscAmount'),
};

const deleteInventoryCostRequest = {
  params: Joi.object().keys({
    inventoryItemId: Joi.number().required(),
    productCostId: Joi.number().required(),
  }),
  body: Joi.object().keys(requiresAccountAndMarketplace),
};

module.exports = {
  getInventoryListRequest,
  getInventoryCostListRequest,
  addInventoryCostRequest,
  updateInventoryRequest,
  updateInventoryCostRequest,
  deleteInventoryCostRequest,
};
