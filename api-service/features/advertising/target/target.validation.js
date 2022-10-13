const Joi = require('joi');
const TargetRepository = require('./target.repository');

const {
  metricFilterValidations,
  additionalFilters,
  attributesValidation,
} = require('../advertising.validation');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@features/base/base.validation');

const listTargetsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...metricFilterValidations(),
    ...requiresAccountAndMarketplace,
    startDate: Joi.date(),
    endDate: Joi.date(),
    state: Joi.string().valid('enabled', 'paused', 'archived'),
    expressionType: Joi.string().valid('auto', 'manual'),
    attributes: attributesValidation(TargetRepository.getAttributes(), [
      'advTargetId',
      'targetingText',
    ]),
    campaignType: Joi.string()
      .required()
      .valid('sponsoredProducts', 'sponsoredDisplay'),
    include: Joi.array()
      .items(Joi.string().valid('previousData', 'adGroup'))
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

module.exports = { listTargetsRequest };
