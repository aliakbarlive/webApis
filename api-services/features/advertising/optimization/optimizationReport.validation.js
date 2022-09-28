const Joi = require('joi');

const {
  requiresDateRange,
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@validations/base.validation');

const {
  requiresCampaignType,
  requiresRecordType,
} = require('@validations/advertising.validation');

const createOptimizationReport = {
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    ...requiresCampaignType,
    ...requiresRecordType,
    ruleIds: Joi.array().items(Joi.number()).required().min(1).messages({
      'array.min': 'Please select at least one rule',
    }),
  }),
};

const getOptimizationReport = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    include: Joi.array().items(Joi.string().valid('selectedItems', 'rules')),
  }),
};

const processOptimizationReport = {
  params: {
    reportId: Joi.number().required(),
  },
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

const getOptimizationReportItems = {
  params: Joi.object().keys({
    reportId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    target: Joi.string().valid('', 'product', 'keyword'),
    matchType: Joi.array().items(
      Joi.string().valid('', 'exact', 'phrase', 'broad')
    ),
  }),
};

const updateOptimizationReportItemOption = {
  params: {
    reportId: Joi.number().required(),
    optionId: Joi.string().required(),
    itemId: Joi.string().required(),
  },
  body: {
    selected: Joi.boolean(),
    data: Joi.object().required(),
    ...requiresAccountAndMarketplace,
    advOptimizationReportRuleId: Joi.number(),
  },
};

module.exports = {
  createOptimizationReport,
  processOptimizationReport,
  getOptimizationReport,
  getOptimizationReportItems,
  updateOptimizationReportItemOption,
};
