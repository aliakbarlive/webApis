const Joi = require('joi');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('./base.validation');

const getKeywordListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    startDate: Joi.date()
      .when('scope', {
        is: 'topRanked',
        then: Joi.date().required(),
      })
      .when('include', {
        is: 'records',
        then: Joi.date().required(),
      }),
    endDate: Joi.date()
      .when('scope', {
        is: 'topRanked',
        then: Joi.date().required(),
      })
      .when('include', {
        is: 'records',
        then: Joi.date().required(),
      }),
    scope: Joi.string().valid('topRanked'),
    include: Joi.string().valid('records'),
    asin: Joi.string(),
  }),
};

const getKeywordRequest = {
  params: Joi.object().keys({
    keywordId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    startDate: Joi.date().when('include', {
      is: 'records',
      then: Joi.date().required(),
    }),
    endDate: Joi.date().when('include', {
      is: 'records',
      then: Joi.date().required(),
    }),
    include: Joi.string().valid('records'),
  }),
};

const updateKeywordRequest = {
  params: Joi.object().keys({
    keywordId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    status: Joi.string().valid('active', 'inactive'),
  }),
};

const addKeywordRequest = {
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    asin: Joi.string().required(),
    keywordText: Joi.string().required(),
  }),
};

const searchKeywordsRequest = {
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    keywords: Joi.array().items(
      Joi.object().keys({
        keywordText: Joi.string().required(),
        asin: Joi.string().required(),
      })
    ),
  }),
};

module.exports = {
  addKeywordRequest,
  getKeywordRequest,
  getKeywordListRequest,
  updateKeywordRequest,
  searchKeywordsRequest,
};
