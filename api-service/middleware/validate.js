const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ErrorResponse = require('../utils/errorResponse');
const { startCase, capitalize, last } = require('lodash');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object, {
      abortEarly: false,
    });

  if (error) {
    console.log(
      error.details.map((errDetail) => errDetail.type),
      error,
      'joi errors'
    );

    let errors = {};

    error.details.map((details) => {
      const { message, path } = details;
      const objectKey = path
        .join('.')
        .replace('body.', '')
        .replace('query.', '');
      const key = last(objectKey.split('.'));

      errors[objectKey] = message
        .split(`\"`)
        .join('')
        .replace(key, capitalize(startCase(key)));
    });

    return next(
      new ErrorResponse('Validation Error', httpStatus.BAD_REQUEST, errors)
    );
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
