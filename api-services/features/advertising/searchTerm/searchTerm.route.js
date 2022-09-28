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

const searchTermValidation = require('./searchTerm.validation');
const searchTermController = require('./searchTerm.controller');

router.get(
  '/',
  validate(searchTermValidation.listSearchTermsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  withDateRange,
  searchTermController.listSearchTerms
);

module.exports = router;
