const Joi = require('joi');
const CampaignRepository = require('./campaign.repository');

const {
  metricFilterValidations,
  additionalFilters,
  attributesValidation,
} = require('../advertising.validation');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
  requiresDateRange,
} = require('@features/base/base.validation');

const { getMetricNames } = require('../utils/metrics');

const listCampaignsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...metricFilterValidations(),
    ...requiresAccountAndMarketplace,
    startDate: Joi.date(),
    endDate: Joi.date(),
    scope: Joi.string().valid('withBudgetRecommendation').default(''),
    state: Joi.string().valid('enabled', 'paused', 'archived'),
    targetingType: Joi.string().valid('auto', 'manual'),
    advPortfolioIds: Joi.array().items(Joi.number()).default([]),
    attributes: attributesValidation(CampaignRepository.getAttributes(), [
      'advCampaignId',
      'name',
    ]),
    campaignType: Joi.string().valid(
      'sponsoredProducts',
      'sponsoredBrands',
      'sponsoredDisplay'
    ),
    include: Joi.array()
      .items(
        Joi.string().valid('portfolio', 'budgetRecommendation', 'previousData')
      )
      .default([]),
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

const updateCampaignRequest = {
  params: Joi.object().keys({
    campaignId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    data: Joi.object()
      .keys({
        state: Joi.string().valid('enabled', 'paused', 'archived'),
        dailyBudget: Joi.number(),
        budget: Joi.number(),
      })
      .or('state', 'dailyBudget', 'budget'),
  }),
};

const applyRecommendedBudgetRequest = {
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    campaignType: Joi.string().valid('sponsoredProducts'),
    campaignIds: Joi.array()
      .required()
      .items(Joi.number().required())
      .min(1)
      .unique(),
  }),
};

const getCampaignRecordsRequest = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    attributes: Joi.array()
      .required()
      .items(
        Joi.string()
          .required()
          .valid('date', ...getMetricNames())
      )
      .min(1)
      .unique(),
    campaignTypes: Joi.array().items(Joi.string()).default([]),
    targetingTypes: Joi.array().items(Joi.string()).default([]),
    states: Joi.array().items(Joi.string()).default([]),
    advCampaignIds: Joi.array().items(Joi.number()).default([]),
    advPortfolioIds: Joi.array().items(Joi.number()).default([]),
  }),
};

const getCampaignPerformanceRequest = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    attributes: Joi.array()
      .required()
      .items(
        Joi.string()
          .required()
          .valid('date', ...getMetricNames())
      )
      .min(1)
      .unique(),
    campaignTypes: Joi.array().items(Joi.string()).default([]),
    targetingTypes: Joi.array().items(Joi.string()).default([]),
    states: Joi.array().items(Joi.string()).default([]),
    advCampaignIds: Joi.array().items(Joi.number()).default([]),
    advPortfolioIds: Joi.array().items(Joi.number()).default([]),
  }),
};

const getWeeklyCampaignRecordsRequest = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    attributes: Joi.array()
      .required()
      .items(
        Joi.string()
          .required()
          .valid('date', ...getMetricNames())
      )
      .min(1)
      .unique(),
    campaignTypes: Joi.array().items(Joi.string()).default([]),
    targetingTypes: Joi.array().items(Joi.string()).default([]),
    states: Joi.array().items(Joi.string()).default([]),
    advCampaignIds: Joi.array().items(Joi.number()).default([]),
    advPortfolioIds: Joi.array().items(Joi.number()).default([]),
  }),
};

module.exports = {
  listCampaignsRequest,
  updateCampaignRequest,
  getCampaignRecordsRequest,
  applyRecommendedBudgetRequest,
  getWeeklyCampaignRecordsRequest,
  getCampaignPerformanceRequest,
};
