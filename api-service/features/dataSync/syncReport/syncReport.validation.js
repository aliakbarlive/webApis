const Joi = require('joi');

const { listBaseValidation } = require('@features/base/base.validation');

const listSyncReportsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    syncRecordId: Joi.number(),
    status: Joi.string().valid(
      'STARTED',
      'REQUESTING',
      'REQUESTED',
      'PROCESSING',
      'PROCESSED',
      'FAILED'
    ),
  }),
};

module.exports = {
  listSyncReportsRequest,
};
