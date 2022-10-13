const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
  requiresDateRange,
} = require('./base.validation');

const getAlertListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    type: Joi.string(),
    'listing.asin': Joi.string(),
    scope: Joi.string().valid('resolved', 'unresolved'),
  }),
};

const getAlertDetailsRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

const resolveAlertRequest = {
  params: Joi.object().keys({
    alertId: Joi.string().guid().required(),
  }),
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

const unresolveAlertRequest = {
  params: Joi.object().keys({
    alertId: Joi.string().guid().required(),
  }),
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

module.exports = {
  getAlertListRequest,
  getAlertDetailsRequest,
  resolveAlertRequest,
  unresolveAlertRequest,
};
