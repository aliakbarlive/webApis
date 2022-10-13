const Validator = require('validatorjs');
const ErrorResponse = require('../utils/errorResponse');
const moment = require('moment');

Validator.register(
  'telephone',
  function (value, requirement, attribute) {
    var regExp = new RegExp(/^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/);
    return regExp.test(value);
  },
  'The :attribute phone number is not in the format (XXX)XXX-XXXX.'
);

// register custom rule
Validator.register(
  'after_or_equal',
  function (date, params) {
    const val1 = date;
    const val2 = params.split(',')[0];

    return moment(val1).isSameOrAfter(val2);
  },
  'The :attribute must be equal or after :after_or_equal.'
);

const validator = (body, rules, customMessages = {}, callback) => {
  const validation = new Validator(body, rules, customMessages);

  validation.passes(() => callback && callback(null, true));
  validation.fails(() => {
    if (callback) {
      return callback(validation.errors, false);
    }

    throw new ErrorResponse(
      'The given data was invalid.',
      422,
      validation.errors.all()
    );
  });
};

module.exports = validator;
