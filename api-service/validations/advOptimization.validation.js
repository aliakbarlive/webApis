const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
  requiresDateRange,
} = require('./base.validation');

const {
  requiresCampaignType,
  requiresRecordType,
} = require('./advertising.validation');

const optimizationsRequest = {
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    ...requiresCampaignType,
    ...requiresRecordType,
    optimizations: Joi.array()
      .required()
      .items(
        Joi.object().keys({
          ruleId: Joi.number().required(),
          optimizableId: Joi.number().required(),
          values: Joi.object().required(),
          data: Joi.object().required(),
        })
      )
      .min(1)
      .unique(),
  }),
};

const getAdvOptimizationsRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresCampaignType,
    ...listBaseValidation,
    optimizableId: Joi.number(),
    optimizableType: Joi.string(),
    attributes: Joi.array()
      .items(
        Joi.string().valid(
          'advOptimizationId',
          'advOptimizationBatchId',
          'optimizableId',
          'optimizableType',
          'values',
          'rule',
          'data',
          'status',
          'createdAt',
          'updatedAt'
        )
      )
      .default({})
      .unique(),
    include: Joi.array()
      .items(Joi.string().valid('batch', 'changes'))
      .default([])
      .unique(),
  }),
};

module.exports = {
  optimizationsRequest,
  getAdvOptimizationsRequest,
};
