const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const { account, marketplace, advProfile } = require('@middleware/access');

const {
  paginate,
  withSort,
  withDateRange,
} = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const keywordValidation = require('./keyword.validation');
const keywordController = require('./keyword.controller');

router.get(
  '/',
  validate(keywordValidation.listKeywordsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  withDateRange,
  keywordController.listKeywords
);

module.exports = router;
