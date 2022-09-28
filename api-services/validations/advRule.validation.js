const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('./base.validation');
const { requiresCampaignType } = require('./advertising.validation');

const recordType = Joi.string().valid(
  'campaigns',
  'adGroups',
  'keywords',
  'targets',
  'searchTerms'
);

const optimizeAllocation = Joi.object().keys({
  type: Joi.string().required().valid('changeTo', 'decreaseBy', 'increaseBy'),
  value: Joi.required().when('type', {
    is: 'changeTo',
    then: Joi.number(),
    otherwise: Joi.object().keys({
      type: Joi.string().required().valid('percentage', 'value'),
      value: Joi.number(),
    }),
  }),
});

const updateStatusValidation = Joi.object().keys({
  state: Joi.string().required().valid('enabled', 'paused', 'archived'),
});

const advRuleFormValidation = Joi.object().keys({
  ...requiresAccountAndMarketplace,
  ...requiresCampaignType,
  recordType,
  name: Joi.string().required(),
  default: Joi.boolean().required(),
  advCampaignIds: Joi.array().items(Joi.number()).unique().default([]),
  advPortfolioIds: Joi.array().items(Joi.number()).unique().default([]),
  products: Joi.array()
    .items(
      Joi.object().keys({
        asin: Joi.string().required().allow(null),
        sku: Joi.string().required().allow(null),
      })
    )
    .unique()
    .default([]),
  actionCode: Joi.string()
    .required()
    .when('recordType', {
      is: 'campaigns',
      then: Joi.valid(
        'SP:CAMPAIGNS:UPDATE_STATUS',
        'SP:CAMPAIGNS:UPDATE_DAILY_BUDGET'
      ),
    })
    .when('recordType', {
      is: 'adGroups',
      then: Joi.valid(
        'SP:AD_GROUPS:UPDATE_STATUS',
        'SP:AD_GROUPS:UPDATE_DEFAULT_BID'
      ),
    })
    .when('recordType', {
      is: 'keywords',
      then: Joi.valid('SP:KEYWORDS:UPDATE_STATUS', 'SP:KEYWORDS:UPDATE_BID'),
    })
    .when('recordType', {
      is: 'targets',
      then: Joi.valid('SP:TARGETS:UPDATE_STATUS', 'SP:TARGETS:UPDATE_BID'),
    })
    .when('recordType', {
      is: 'searchTerms',
      then: Joi.valid(
        'SP:SEARCH_TERMS:CONVERT_AS_NEGATIVE_KEYWORD',
        'SP:SEARCH_TERMS:CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP',
        'SP:SEARCH_TERMS:CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP'
      ),
    }),
  actionData: Joi.any().when('actionCode', {
    switch: [
      { is: 'SP:CAMPAIGNS:UPDATE_DAILY_BUDGET', then: optimizeAllocation },
      { is: 'SP:CAMPAIGNS:UPDATE_STATUS', then: updateStatusValidation },
      { is: 'SP:AD_GROUPS:UPDATE_STATUS', then: updateStatusValidation },
      { is: 'SP:KEYWORDS:UPDATE_STATUS', then: updateStatusValidation },
      { is: 'SP:TARGETS:UPDATE_STATUS', then: updateStatusValidation },
      { is: 'SP:KEYWORDS:UPDATE_BID', then: optimizeAllocation },
      { is: 'SP:TARGETS:UPDATE_BID', then: optimizeAllocation },
      {
        is: 'SP:SEARCH_TERMS:CONVERT_AS_NEGATIVE_KEYWORD',
        then: Joi.object().keys({
          matchType: Joi.string()
            .required()
            .valid('negativePhrase', 'negativeExact'),
          level: Joi.string().required().valid('adGroups', 'campaigns'),
        }),
      },
    ],
  }),
  filters: Joi.array()
    .required()
    .items(
      Joi.object().keys({
        attribute: Joi.string().required(),
        comparison: Joi.string().required(),
        value: Joi.required().when('comparison', {
          is: 'between',
          then: Joi.array().items(Joi.number()).min(1).unique().length(2),
          otherwise: Joi.when('attribute', {
            switch: [
              {
                is: 'bid',
                then: Joi.alternatives().try(
                  Joi.number(),
                  Joi.string().valid('cpc')
                ),
              },
              { is: 'servingStatus', then: Joi.string() },
            ],
            otherwise: Joi.number(),
          }),
        }),
      })
    )
    .min(1)
    .unique(),
});

const getAdvRuleListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresCampaignType,
    ...requiresAccountAndMarketplace,
    recordType,
  }),
};

const getAdvRuleRequest = {
  params: {
    advRuleId: Joi.number().required(),
  },
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

const createAdvRuleRequest = {
  body: advRuleFormValidation,
};

const updateAdvRuleRequest = {
  params: {
    advRuleId: Joi.number().required(),
  },
  body: advRuleFormValidation,
};

module.exports = {
  getAdvRuleRequest,
  getAdvRuleListRequest,
  createAdvRuleRequest,
  updateAdvRuleRequest,
};
