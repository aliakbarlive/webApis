const Joi = require('joi');

const {
  requiresDateRange,
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('@features/base/base.validation');

const attributesValidation = Joi.string()
  .required()
  .valid(
    'impressions',
    'clicks',
    'cost',
    'attributedConversions1d',
    'attributedConversions7d',
    'attributedConversions14d',
    'attributedConversions30d',
    'attributedConversions1dSameSKU',
    'attributedConversions7dSameSKU',
    'attributedConversions14dSameSKU',
    'attributedConversions30dSameSKU',
    'attributedUnitsOrdered1d',
    'attributedUnitsOrdered7d',
    'attributedUnitsOrdered14d',
    'attributedUnitsOrdered30d',
    'attributedSales1d',
    'attributedSales7d',
    'attributedSales14d',
    'attributedSales30d',
    'attributedSales1dSameSKU',
    'attributedSales7dSameSKU',
    'attributedSales14dSameSKU',
    'attributedSales30dSameSKU',
    'attributedUnitsOrdered1dSameSKU',
    'attributedUnitsOrdered7dSameSKU',
    'attributedUnitsOrdered14dSameSKU',
    'attributedUnitsOrdered30dSameSKU',
    'attributedDPV14d',
    'attributedUnitsSold14d',
    'attributedDetailPageViewsClicks14d',
    'attributedOrdersNewToBrand14d',
    'attributedOrdersNewToBrandPercentage14d',
    'attributedOrderRateNewToBrand14d',
    'attributedSalesNewToBrand14d',
    'attributedSalesNewToBrandPercentage14d',
    'attributedUnitsOrderedNewToBrand14d',
    'attributedUnitsOrderedNewToBrandPercentage14d',
    'unitsSold14d',
    'dpv14d',
    'acos',
    'cpc',
    'ctr',
    'cr',
    'profit',
    'aov',
    'sales',
    'orders',
    'roas'
  );

const getKeywordsDistribution = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    attribute: attributesValidation,
  }),
};

const getFunnel = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
  }),
};

const getOverallPerformance = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    campaignTypes: Joi.array().items(Joi.string()).default([]),
    targetingTypes: Joi.array().items(Joi.string()).default([]),
    states: Joi.array().items(Joi.string()).default([]),
    states: Joi.array().items(Joi.string()).default([]),
    advCampaignIds: Joi.array().items(Joi.number()).default([]),
    advPortfolioIds: Joi.array().items(Joi.number()).default([]),
    getDiffInMonth: Joi.boolean().default(false),
  }),
};

const getPerformanceByGranularity = {
  params: Joi.object().keys({
    granularity: Joi.string().required().valid('month', 'week'),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    campaignTypes: Joi.array().items(Joi.string()).default([]),
    targetingTypes: Joi.array().items(Joi.string()).default([]),
    states: Joi.array().items(Joi.string()).default([]),
    advCampaignIds: Joi.array().items(Joi.number()).default([]),
    advPortfolioIds: Joi.array().items(Joi.number()).default([]),
  }),
};

const getProfilePerformance = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    attributes: Joi.array().required().items(attributesValidation).min(1),
    campaignType: Joi.string().valid(
      'sponsoredProducts',
      'sponsoredBrands',
      'sponsoredDisplay'
    ),
  }),
};

const getCampaignTypesSummary = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
  }),
};

const getCampaignTypesPerformance = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    attributes: Joi.array().required().items(attributesValidation).min(1),
  }),
};

const getTargetingTypesPerformance = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    attributes: Joi.array().required().items(attributesValidation).min(1),
  }),
};

const getChangesByCampaigns = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    ...listBaseValidation,
    attribute: attributesValidation,
  }),
};

const getChangesByProducts = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    ...listBaseValidation,
    attribute: attributesValidation,
  }),
};

const getChangesByKeywords = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
    ...listBaseValidation,
    attribute: attributesValidation,
    campaignType: Joi.string().valid(
      'sponsoredProducts',
      'sponsoredBrands',
      'sponsoredDisplay'
    ),
  }),
};

const getKeywordConvertersSummary = {
  query: Joi.object().keys({
    ...requiresDateRange,
    ...requiresAccountAndMarketplace,
  }),
};

module.exports = {
  getFunnel,
  getKeywordsDistribution,
  getChangesByKeywords,
  getChangesByProducts,
  getChangesByCampaigns,
  getOverallPerformance,
  getProfilePerformance,
  getCampaignTypesSummary,
  getPerformanceByGranularity,
  getKeywordConvertersSummary,
  getCampaignTypesPerformance,
  getTargetingTypesPerformance,
};
