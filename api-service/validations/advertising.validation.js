const Joi = require('joi');
const { getStaticAdvMetrics } = require('../services/advMetric.service');
const {
  requiresDateRange,
  requiresAccountAndMarketplace,
} = require('./base.validation');

const comparisons = [
  'LessThan',
  'LessThanOrEqualTo',
  'GreaterThan',
  'GreaterThanOrEqualTo',
  'NotEqualTo',
  'EqualTo',
  'Between',
];

const metricValidations = (additionalFilters = []) => {
  let validations = {};
  const metrics = getStaticAdvMetrics();

  [...additionalFilters, ...metrics].forEach((metric) => {
    validations[metric] = Joi.number();
    comparisons.forEach((comparison) => {
      validations[`${metric}${comparison}`] =
        comparison === 'Between'
          ? Joi.array().items(Joi.number())
          : Joi.number();
    });
  });

  return validations;
};

const additionalFilters = (filters) => {
  let validations = {};

  filters.forEach(({ key, validation }) => {
    validations[key] = validation;

    comparisons.forEach((comparison) => {
      validations[`${key}${comparison}`] =
        comparison === 'Between' ? Joi.array().items(validation) : validation;
    });
  });

  return validations;
};

const requiresCampaignType = {
  campaignType: Joi.string()
    .required()
    .valid('sponsoredProducts', 'sponsoredBrands', 'sponsoredDisplay'),
};

const requiresRecordType = {
  recordType: Joi.string()
    .required()
    .valid(
      'campaigns',
      'adGroups',
      'keywords',
      'targets',
      'productAds',
      'searchTerms'
    ),
};

const acceptsAttributes = (basettributes = []) => {
  return {
    attributes: Joi.string().custom((value, helpers) => {
      const allowedAttributes = [...basettributes, ...getStaticAdvMetrics()];

      const isValid = value
        .split(',')
        .every((attribute) => allowedAttributes.includes(attribute));

      if (!isValid) {
        throw new Error('Invalid attributes.');
      }

      return value;
    }),
  };
};

const exportDataRequest = {
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    ...requiresDateRange,
    ...requiresCampaignType,
    ...requiresDateRange,
    ...metricValidations(),
    sort: Joi.string(),
    search: Joi.string().empty(''),
    recordType: Joi.string()
      .required()
      .valid(
        'campaigns',
        'adGroups',
        'keywords',
        'targets',
        'productAds',
        'searchTerms'
      ),
    state: Joi.string().valid('enabled', 'paused', 'archived'),
    targetingType: Joi.string().valid('auto', 'manual'),
    matchType: Joi.string().valid('broad', 'exact', 'phrase'),
    expressionType: Joi.string().valid('auto', 'manual'),
    attributes: Joi.string(),
  }),
};

module.exports = {
  metricValidations,
  acceptsAttributes,
  additionalFilters,
  requiresCampaignType,
  requiresRecordType,
  exportDataRequest,
};
