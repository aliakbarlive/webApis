const Joi = require('joi');
const { listBaseValidation } = require('./base.validation');

const getAgencyClientsListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    status: Joi.string().empty(''),
    migrateOnly: Joi.boolean().default(false),
  }),
};

const getAgencyClientRequest = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
};

const agencyClientRequest = {
  body: Joi.object().keys({
    client: Joi.string().required(),
    address: Joi.string().allow('', null),
    phone: Joi.string().allow('', null),
    serviceAgreementLink: Joi.string().uri().allow('', null),
    siEmail: Joi.string().email().allow('', null),
    website: Joi.string().uri().allow('', null),
    aboutUs: Joi.string().allow('', null),
    overview: Joi.string().allow('', null),
    painPoints: Joi.string().allow('', null),
    goals: Joi.string().allow('', null),
    productCategories: Joi.string().allow('', null),
    amazonPageUrl: Joi.string().uri().allow('', null),
    asinsToOptimize: Joi.string().allow('', null),
    categoryList: Joi.array(),
    asinList: Joi.array(),
    otherNotes: Joi.string().allow('', null),
    email: Joi.string().email().required(),
    pricebook_id: Joi.string().empty(''),
    currency_code: Joi.string().default('USD'),
    name: Joi.string().empty(''),
    plan_code: Joi.string().required(),
    plan_description: Joi.string()
      .required()
      .regex(/[<>]/, { invert: true })
      .messages({
        'string.pattern.invert.base':
          'Description must not have any (<) less than or (>) greater than symbol',
      }),
    price: Joi.number().required(),
    convert_retainer_cycle: Joi.number().empty(''),
    retainer_after_convert: Joi.number().empty(''),
    billing_cycles: Joi.number().empty(''),
    mailInvite: Joi.number().min(0).max(1),
    reference_id: Joi.string().guid().allow(''),
    addons: Joi.array()
      .unique('addon_code')
      .messages({ 'array.unique': 'Duplicate addons are not allowed' })
      .items(
        Joi.object().keys({
          addon_code: Joi.string().required().messages({
            required: 'Addon code is not allowed to be empty',
          }),
          addon_description: Joi.string().empty(''),
          name: Joi.string().empty(''),
          price: Joi.number().messages({
            'number.base': 'Addon price must be a number',
          }),
          quantity: Joi.number().min(1).messages({
            'number.min': 'Addon quantity must be 1 or more',
            'number.base': 'Addon quantity must be a number',
          }),
          type: Joi.string().valid('one_time', 'recurring'),
        })
      ),
    type: Joi.string(),
    rate: Joi.number(),
    marketplaceId: Joi.string().empty(''),
    monthThreshold: Joi.number(),
    preContractAvgBenchmark: Joi.number().messages({
      'number.base': 'Baseline must be a number',
    }),
    commence: Joi.boolean(),
    rules: Joi.array().allow(null),
    charge_admin_fee: Joi.string(),
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
    status: Joi.string().required(),
    zohoId: Joi.string().allow(null),
    salesPerson: Joi.string().allow('', null),
    defaultMarketplace: Joi.string().required(),
    noCommission: Joi.boolean(),
    noCommissionReason: Joi.required().when('noCommission', {
      is: true,
      then: Joi.string().required().messages({
        'string.empty': 'Reason  is not allowed to be empty',
      }),
    }),
  }),
};

const updateExistingClientRequest = {
  body: Joi.object().keys({
    client: Joi.string().required(),
    serviceAgreementLink: Joi.string().uri().empty(''),
    address: Joi.string().empty(''),
    phone: Joi.string().empty(''),
    siEmail: Joi.string().email().empty(''),
    contractSigned: Joi.string().allow(null, ''),
    contactName: Joi.string().allow(null, ''),
    contactName2: Joi.string().allow(null, ''),
    primaryEmail: Joi.string().email().allow(null, ''),
    secondaryEmail: Joi.string().email().allow(null, ''),
    thirdEmail: Joi.string().email().allow(null, ''),
    service: Joi.string().allow(null, ''),
    accountStatus: Joi.string().allow(null, ''),
    website: Joi.string().uri().empty(''),
    aboutUs: Joi.string().empty(''),
    overview: Joi.string().empty(''),
    painPoints: Joi.string().empty(''),
    goals: Joi.string().empty(''),
    categoryList: Joi.array(),
    amazonPageUrl: Joi.string().uri().empty(''),
    asinList: Joi.array(),
    otherNotes: Joi.string().empty(''),
  }),
};

module.exports = {
  getAgencyClientsListRequest,
  getAgencyClientRequest,
  agencyClientRequest,
  updateExistingClientRequest,
};
