const Joi = require('joi');

const { listBaseValidation } = require('@validations/base.validation');
const {
  CHANGE_REQUEST_TYPE_APPLY_CAMPAIGN_RECOMMENDED_BUDGET,
  CHANGE_REQUEST_TYPE_UPDATE_CAMPAIGN_MANUALLY,
  CHANGE_REQUEST_TYPE_OPTIMIZATION,
} = require('@utils/constants');

const listChangeRequests = {
  query: Joi.object().keys({
    ...listBaseValidation,
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    type: Joi.string().valid(
      CHANGE_REQUEST_TYPE_APPLY_CAMPAIGN_RECOMMENDED_BUDGET,
      CHANGE_REQUEST_TYPE_UPDATE_CAMPAIGN_MANUALLY,
      CHANGE_REQUEST_TYPE_OPTIMIZATION
    ),
  }),
};

const getChangeRequest = {
  params: Joi.object().keys({
    changeRequestId: Joi.string().guid().required(),
  }),
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    include: Joi.array().items(
      Joi.string().valid('optimizationBatch', 'items', 'advProfile')
    ),
  }),
};

const rejectChangeRequest = {
  params: Joi.object().keys({
    changeRequestId: Joi.string().guid().required(),
  }),
  body: Joi.object().keys({
    items: Joi.array().items(Joi.number().required()).min(1),
  }),
};

const approveChangeRequest = {
  params: Joi.object().keys({
    changeRequestId: Joi.string().guid().required(),
  }),
  body: Joi.object().keys({
    items: Joi.array().items(Joi.number()).required().min(1),
  }),
};

module.exports = {
  getChangeRequest,
  listChangeRequests,
  rejectChangeRequest,
  approveChangeRequest,
};
