const Joi = require('joi');

const { listBaseValidation } = require('@features/base/base.validation');

const listSyncRecordsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    include: Joi.array().items(Joi.string().valid('account')).default([]),
    syncType: Joi.string().valid('initial', 'daily', 'hourly'),
    status: Joi.string().valid(
      'STARTED',
      'REQUESTING',
      'REQUESTED',
      'PROCESSING',
      'PROCESSED',
      'FAILED'
    ),
    dataType: Joi.string().valid(
      'inventory',
      'products',
      'reviews',
      'financialEvents',
      'inboundFBAShipments',
      'inboundFBAShipmentItems',
      'advSnapshots',
      'advPerformanceReport'
    ),
  }),
};

const getSyncRecordRequest = {
  params: Joi.object().keys({ syncRecordId: Joi.number().required() }),
  query: Joi.object().keys({
    include: Joi.array().items(Joi.string().valid('account')).default([]),
  }),
};

const initSyncRecordsCronRequest = {
  body: Joi.object().keys({
    dataType: Joi.string()
      .required()
      .valid('advPerformanceReport', 'advSnapshots'),
  }),
};

module.exports = {
  getSyncRecordRequest,
  listSyncRecordsRequest,
  initSyncRecordsCronRequest,
};
