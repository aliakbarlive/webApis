const Joi = require('joi');

const listBaseValidation = {
  page: Joi.number().min(1).default(1),
  pageSize: Joi.number().min(1).default(10),
  sort: Joi.string(),
  search: Joi.string().empty(''),
};

const requiresAccountAndMarketplace = {
  accountId: Joi.string().guid().required(),
  marketplace: Joi.string().required().valid('US', 'CA', 'MX', 'BR'),
};

const requiresDateRange = {
  startDate: Joi.date().raw().required(),
  endDate: Joi.date().raw().required(),
};

module.exports = {
  requiresDateRange,
  listBaseValidation,
  requiresAccountAndMarketplace,
};
