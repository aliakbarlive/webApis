const Joi = require('joi');
const KeywordRepository = require('./keyword.repository');

const {
  metricFilterValidations,
  additionalFilters,
  attributesValidation,
} = require('../advertising.validation');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@features/base/base.validation');

const listKeywordsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...metricFilterValidations(),
    ...requiresAccountAndMarketplace,
    startDate: Joi.date(),
    endDate: Joi.date(),
    state: Joi.string().valid('enabled', 'paused', 'archived'),
    matchType: Joi.string().valid('broad', 'exact', 'phrase'),
    attributes: attributesValidation(KeywordRepository.getAttributes(), [
      'advKeywordId',
      'keywordText',
      'matchType',
    ]),
    keywordText: Joi.string(),
    campaignType: Joi.string().valid('sponsoredProducts', 'sponsoredBrands'),
    include: Joi.array()
      .items(Joi.string().valid('previousData', 'adGroup', 'metricsRanking'))
      .default([]),
    ...additionalFilters(
      ['bid'].map((key) => {
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

module.exports = { listKeywordsRequest };
