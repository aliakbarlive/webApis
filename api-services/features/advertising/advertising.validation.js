const Joi = require('joi');
const { getMetricNames } = require('./utils/metrics');

const comparisons = [
  'LessThan',
  'LessThanOrEqualTo',
  'GreaterThan',
  'GreaterThanOrEqualTo',
  'NotEqualTo',
  'EqualTo',
  'Between',
];

const attributesValidation = (initial = [], defaultValue = []) => {
  return Joi.string()
    .custom((value) => {
      const isValid = value
        .split(',')
        .every((attribute) =>
          [...initial, ...getMetricNames()].includes(attribute)
        );

      if (!isValid) {
        throw new Error('Invalid attributes.');
      }

      return value.split(',');
    })
    .default(defaultValue);
};

const metricFilterValidations = () => {
  let validations = {};

  getMetricNames().forEach((metric) => {
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

module.exports = {
  additionalFilters,
  attributesValidation,
  metricFilterValidations,
};
