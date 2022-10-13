const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@features/base/base.validation');

const {
  attributesValidation,
  metricFilterValidations,
} = require('../advertising.validation');

const listReportsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    campaignType: Joi.string().valid(
      'sponsoredProducts',
      'sponsoredBrands',
      'sponsoredDisplay'
    ),
    type: Joi.string(),
    status: Joi.string(),
    include: Joi.array().items(Joi.string().valid('generatedBy')).default([]),
  }),
};

const createReportRequest = {
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    startDate: Joi.date().raw().required(),
    endDate: Joi.date().raw().required(),
    campaignType: Joi.string().valid(
      'sponsoredProducts',
      'sponsoredBrands',
      'sponsoredDisplay'
    ),
    type: Joi.string().required().valid('analytics', 'interactive-analytics'),
    data: Joi.object().keys({
      passAction: Joi.string().empty(''),
      analysis: Joi.string().empty(''),
      futurePlanOfAction: Joi.string().empty(''),
    }),
    options: Joi.object().keys({
      displayCampaignTypeChart: Joi.boolean().default(false),
      displayTargetingTypeChart: Joi.boolean().default(false),
    }),
  }),
};

const getReportRequest = {
  params: Joi.object().keys({
    reportId: Joi.string().guid().required(),
  }),
};

const getReportTargetingDistributionRequest = {
  params: Joi.object().keys({
    reportId: Joi.string().guid().required(),
  }),
  query: Joi.object().keys({
    attribute: Joi.string(),
  }),
};

const getReportTargetingsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...metricFilterValidations(),
    attributes: attributesValidation(
      [
        'advTargetingId',
        'advKeywordId',
        'advTargetId',
        'value',
        'advAdGroupId',
      ],
      ['advTargetingId', 'value']
    ),
    include: Joi.array()
      .items(Joi.string().valid('metricsRanking'))
      .default([]),
  }),
};

module.exports = {
  getReportRequest,
  listReportsRequest,
  createReportRequest,
  getReportTargetingsRequest,
  getReportTargetingDistributionRequest,
};
