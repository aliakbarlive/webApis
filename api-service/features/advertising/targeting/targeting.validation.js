const Joi = require('joi');

const {
  metricFilterValidations,
  attributesValidation,
} = require('../advertising.validation');

const {
  requiresDateRange,
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@features/base/base.validation');

const listTargetingsRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...listBaseValidation,
    ...metricFilterValidations(),
    startDate: Joi.date(),
    endDate: Joi.date(),
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

const getTargetingsConversionSummaryRequest = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
  }),
};

const getTargetingDistributionRequest = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    attribute: Joi.string(),
  }),
};

module.exports = {
  listTargetingsRequest,
  getTargetingsConversionSummaryRequest,
  getTargetingDistributionRequest,
};
