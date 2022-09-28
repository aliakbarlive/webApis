const Joi = require('joi');
const AdGroupRepository = require('./adGroup.repository');

const {
  metricFilterValidations,
  additionalFilters,
  attributesValidation,
} = require('../advertising.validation');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@features/base/base.validation');

const listAdGroupsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...metricFilterValidations(),
    ...requiresAccountAndMarketplace,
    startDate: Joi.date(),
    endDate: Joi.date(),
    state: Joi.string().valid('enabled', 'paused', 'archived'),
    advCampaignId: Joi.number(),
    advAdGroupIds: Joi.array().items(Joi.number()),
    attributes: attributesValidation(AdGroupRepository.getAttributes(), [
      'advAdGroupId',
      'name',
    ]),
    campaignType: Joi.string()
      .required()
      .valid('sponsoredProducts', 'sponsoredBrands', 'sponsoredDisplay'),
    include: Joi.array()
      .items(Joi.string().valid('previousData', 'campaign'))
      .default([]),
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
  }),
};

module.exports = { listAdGroupsRequest };
