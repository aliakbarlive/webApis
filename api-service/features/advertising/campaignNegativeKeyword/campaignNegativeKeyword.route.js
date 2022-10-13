const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const { account, marketplace, advProfile } = require('@middleware/access');

const { paginate, withSort } = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const campaignNegativeKeywordValidation = require('./campaignNegativeKeyword.validation');
const campaignNegativeKeywordController = require('./campaignNegativeKeyword.controller');

router.get(
  '/',
  validate(
    campaignNegativeKeywordValidation.listCampaignNegativeKeywordsRequests
  ),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  campaignNegativeKeywordController.listCampaignNegativeKeywords
);

module.exports = router;
