const Joi = require('joi');
const { keys } = require('lodash');

const { AdvCampaign } = require('../models');

const {
  metricValidations,
  acceptsAttributes,
  additionalFilters,
  requiresCampaignType,
} = require('./advertising.validation');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
  requiresDateRange,
} = require('./base.validation');

const getAdvCampaignsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    ...requiresCampaignType,
    ...metricValidations(),
    ...acceptsAttributes(keys(AdvCampaign.rawAttributes)),
    rules: Joi.array().items(Joi.number()).min(1).unique(),
    state: Joi.string().valid('enabled', 'paused', 'archived'),
    targetingType: Joi.string().valid('auto', 'manual'),
    scope: Joi.string().valid('withBudgetRecommendation').default(''),
    conditions: Joi.array(),
    include: Joi.string().valid(
      'previousData',
      'previousData,budgetRecommendation'
    ),
    ...additionalFilters(
      ['dailyBudget', 'budget'].map((key) => {
        return {
          key,
          validation: Joi.alternatives().try(
            Joi.number(),
            Joi.string().valid('cpc')
          ),
        };
      })
    ),
  }),
};

const getAllAdvCampaignRecordsRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    ...requiresCampaignType,
    ...acceptsAttributes(),
  }),
};

const getAllAdvCampaignStatisticsRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresCampaignType,
    ...requiresDateRange,
  }),
};

const getAdvCampaignDetailsRequest = {
  params: Joi.object().keys({
    advCampaignId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

const getAdvCampaignStatisticsRequest = {
  params: Joi.object().keys({
    advCampaignId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
  }),
};

const getAdvCampaignRecordsRequest = {
  params: Joi.object().keys({
    advCampaignId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    ...acceptsAttributes(),
  }),
};

module.exports = {
  getAdvCampaignsRequest,
  getAdvCampaignRecordsRequest,
  getAdvCampaignDetailsRequest,
  getAdvCampaignStatisticsRequest,
  getAllAdvCampaignRecordsRequest,
  getAllAdvCampaignStatisticsRequest,
};
