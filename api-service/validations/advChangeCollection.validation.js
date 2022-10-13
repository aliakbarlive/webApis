const Joi = require('joi');
const { requiresCampaignType } = require('./advertising.validation');

const {
  listBaseValidation,
  requiresAccountAndMarketplace,
} = require('./base.validation');

const getAdvChangeCollectionListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    ...requiresCampaignType,
    include: Joi.array()
      .items(Joi.string().valid('user', 'campaign'))
      .default([])
      .unique(),
  }),
};

module.exports = {
  getAdvChangeCollectionListRequest,
};
