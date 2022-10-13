const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const { account, marketplace, advProfile } = require('@middleware/access');

const { paginate, withSort } = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const negativeKeywordValidation = require('./negativeKeyword.validation');
const negativeKeywordController = require('./negativeKeyword.controller');

router.get(
  '/',
  validate(negativeKeywordValidation.listNegativeKeywordsRequests),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  negativeKeywordController.listNegativeKeywords
);

module.exports = router;
