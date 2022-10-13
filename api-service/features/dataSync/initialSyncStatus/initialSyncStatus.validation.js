const Joi = require('joi');

const { listBaseValidation } = require('@features/base/base.validation');
const statuses = ['COMPLETED', 'PENDING', 'IN-PROGRESS', 'FAILED'];

const listInitialSyncStatusRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    include: Joi.array().items(Joi.string().valid('account')).default([]),
    inventory: Joi.string().valid(...statuses),
    orders: Joi.string().valid(...statuses),
    financialEvents: Joi.string().valid(...statuses),
    products: Joi.string().valid(...statuses),
    reviews: Joi.string().valid(...statuses),
    inboundFBAShipments: Joi.string().valid(...statuses),
    inboundFBAShipmentItems: Joi.string().valid(...statuses),
    advSnapshots: Joi.string().valid(...statuses),
    advPerformanceReport: Joi.string().valid(...statuses),
    scope: Joi.array()
      .items(Joi.string().valid('spApiAuthorized', 'advApiAuthorized'))
      .default([]),
  }),
};

const exportInitialSyncStatusRequest = {
  query: Joi.object().keys({
    sort: Joi.string(),
    search: Joi.string().empty(''),
    include: Joi.array().items(Joi.string().valid('account')).default([]),
    inventory: Joi.string().valid(...statuses),
    orders: Joi.string().valid(...statuses),
    financialEvents: Joi.string().valid(...statuses),
    products: Joi.string().valid(...statuses),
    reviews: Joi.string().valid(...statuses),
    inboundFBAShipments: Joi.string().valid(...statuses),
    inboundFBAShipmentItems: Joi.string().valid(...statuses),
    advSnapshots: Joi.string().valid(...statuses),
    advPerformanceReport: Joi.string().valid(...statuses),
    scope: Joi.array()
      .items(Joi.string().valid('spApiAuthorized', 'advApiAuthorized'))
      .default([]),
  }),
};

const startInitialSyncRequest = {
  body: Joi.object().keys({
    accountIds: Joi.array().items(Joi.string().guid()).min(1).required(),
    dataTypes: Joi.array()
      .items(
        Joi.string().valid('inventory', 'advSnapshots', 'advPerformanceReport')
      )
      .min(1)
      .required(),
  }),
};

module.exports = {
  exportInitialSyncStatusRequest,
  listInitialSyncStatusRequest,
  startInitialSyncRequest,
};
