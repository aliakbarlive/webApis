const Joi = require('joi');
const { password } = require('../utils/customValidation');
const { listBaseValidation } = require('./base.validation');

const updateAccountRequest = {
  params: Joi.object().keys({
    accountId: Joi.string().guid().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    planId: Joi.number(),
    isOnboarding: Joi.boolean(),
  }),
};

const updateAccountMarketplaceRequest = {
  params: Joi.object().keys({
    accountId: Joi.string().guid().required(),
    marketplaceId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    isDefault: Joi.boolean(),
  }),
};

const getAccountMembersRequest = {
  params: Joi.object().keys({
    accountId: Joi.string().guid().required(),
  }),
  query: Joi.object().keys({
    ...listBaseValidation,
  }),
};

module.exports = {
  updateAccountRequest,
  getAccountMembersRequest,
  updateAccountMarketplaceRequest,
};
