const Joi = require('joi');
const { keys } = require('lodash');
const { AdvAdGroup } = require('../models');

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

const getAdvAdGroupsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    ...requiresCampaignType,
    ...metricValidations(),
    ...acceptsAttributes(keys(AdvAdGroup.rawAttributes)),
    ...additionalFilters(
      ['defaultBid'].map((key) => {
        return {
          key,
          validation: Joi.alternatives().try(
            Joi.number(),
            Joi.string().valid('cpc')
          ),
        };
      })
    ),
    advCampaignId: Joi.any(),
    state: Joi.string().valid('enabled', 'paused', 'archived'),
    include: Joi.string().valid('previousData'),
  }),
};

const getAdGroupDetailsRequest = {
  params: Joi.object().keys({
    advAdGroupId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

const getAdGroupStatisticsRequest = {
  params: Joi.object().keys({
    advAdGroupId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
  }),
};

const getAdGroupRecordsRequest = {
  params: Joi.object().keys({
    advAdGroupId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    ...acceptsAttributes(),
  }),
};

const getAdvNegativeTargetsRequest = {
  params: Joi.object().keys({
    advAdGroupId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    expressionType: Joi.string().valid('auto', 'manual'),
    state: Joi.string().valid('enabled', 'paused', 'archived'),
  }),
};

module.exports = {
  getAdvAdGroupsRequest,
  getAdGroupDetailsRequest,
  getAdGroupStatisticsRequest,
  getAdGroupRecordsRequest,
  getAdvNegativeTargetsRequest,
};
