const Joi = require('joi');

const {
  requiresDateRange,
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@validations/base.validation');

const getGroupedHistoryRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    campaignType: Joi.string(),
  }),
};

const listHistoryRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    timestamp: Joi.number(),
    advCampaignId: Joi.number(),
  }),
};

module.exports = { listHistoryRequest, getGroupedHistoryRequest };
