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

const adGroupValidation = require('./adGroup.validation');
const adGroupController = require('./adGroup.controller');

router.get(
  '/',
  validate(adGroupValidation.listAdGroupsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  withDateRange,
  adGroupController.listAdGroups
);

module.exports = router;
