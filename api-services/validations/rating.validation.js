const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('./base.validation');

const getRatingListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    'listing.asin': Joi.string(),
    'listing.status': Joi.string().default('Active'),
  }),
};

const getRatingRequest = {
  params: Joi.object().keys({
    asin: Joi.string().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    include: Joi.string().valid('records'),
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
  getRatingListRequest,
  getRatingRequest,
  resolveAlertRequest,
  unresolveAlertRequest,
};
