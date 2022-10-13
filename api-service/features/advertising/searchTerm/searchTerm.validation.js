const Joi = require('joi');
const SearchTermRepository = require('./searchTerm.repository');

const {
  metricFilterValidations,
  attributesValidation,
} = require('../advertising.validation');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@features/base/base.validation');

const listSearchTermsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...metricFilterValidations(),
    ...requiresAccountAndMarketplace,
    startDate: Joi.date(),
    endDate: Joi.date(),
    target: Joi.string().valid('keyword', 'product'),
    advCampaignId: Joi.any(),
    advAdGroupId: Joi.any(),
    matchType: Joi.string().valid('broad', 'exact', 'phrase'),
    attributes: attributesValidation(SearchTermRepository.getAttributes(), [
      'advSearchTermId',
      'query',
      'target',
    ]),
    campaignType: Joi.string().required().valid('sponsoredProducts'),
    include: Joi.array()
      .items(
        Joi.string().valid(
          'previousData',
          'campaign',
          'keyword',
          'target',
          'adGroup'
        )
      )
      .default([]),
  }),
};

module.exports = { listSearchTermsRequest };
