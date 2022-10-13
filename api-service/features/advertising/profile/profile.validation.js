const Joi = require('joi');

const { listBaseValidation } = require('@features/base/base.validation');

const listProfilesRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    accountId: Joi.string().guid().required(),
  }),
};

module.exports = { listProfilesRequest };
