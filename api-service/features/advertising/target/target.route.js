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

const targetValidation = require('./target.validation');
const targetController = require('./target.controller');

router.get(
  '/',
  validate(targetValidation.listTargetsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  withDateRange,
  targetController.listTargets
);

module.exports = router;
