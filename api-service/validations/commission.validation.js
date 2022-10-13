const Joi = require('joi');

const commissionRequest = {
  body: Joi.object().keys({
    accountId: Joi.string().guid().required(),
    commence: Joi.boolean(),
    commissionId: Joi.number(),
    managedAsins: Joi.array()
      .allow(null)
      .items(
        Joi.object().keys({
          asin: Joi.string()
            .pattern(new RegExp(/([A-Z0-9]{10})/))
            .required()
            .messages({
              'string.empty': 'Managed Asin is not allowed to be empty',
              'string.pattern.base': 'Invalid ASIN.',
            }),
          baseline: Joi.number(),
        })
      ),
    marketplaceId: Joi.string().empty(''),
    monthThreshold: Joi.number(),
    preContractAvgBenchmark: Joi.number().messages({
      'number.base': 'Baseline must be a number',
    }),
    rate: Joi.number().min(0),
    rules: Joi.array().allow(null),
    type: Joi.string(),
    agencyClientId: Joi.string().allow('', null),
    noCommission: Joi.boolean().allow(null),
  }),
};

const updateCommissionRequest = {
  params: Joi.object().keys({
    commissionId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    accountId: Joi.string().guid().required(),
    commissionId: Joi.number().required(),
    commence: Joi.boolean(),
    managedAsins: Joi.array()
      .allow(null)
      .items(
        Joi.object().keys({
          asin: Joi.string()
            .pattern(new RegExp(/([A-Z0-9]{10})/))
            .required()
            .messages({
              'string.empty': 'Managed Asin is not allowed to be empty',
              'string.pattern.base': 'Invalid ASIN.',
            }),
          baseline: Joi.number(),
          sales: Joi.object().allow(null),
        })
      ),
    marketplaceId: Joi.string().empty(''),
    monthThreshold: Joi.number(),
    preContractAvgBenchmark: Joi.number().messages({
      'number.base': 'Baseline must be a number',
    }),
    rate: Joi.number().min(0),
    rules: Joi.array().allow(null),
    type: Joi.string(),
  }),
};

module.exports = {
  commissionRequest,
  updateCommissionRequest,
};
