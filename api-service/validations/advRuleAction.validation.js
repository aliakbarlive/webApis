const Joi = require('joi');

const { listBaseValidation } = require('./base.validation');
const { requiresCampaignType } = require('./advertising.validation');

const getAdvRuleActionListRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresCampaignType,
    recordType: Joi.string()
      .required()
      .valid('campaigns', 'adGroups', 'keywords', 'targets', 'searchTerms'),
  }),
};

module.exports = {
  getAdvRuleActionListRequest,
};
