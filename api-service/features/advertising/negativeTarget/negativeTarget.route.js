const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const { account, marketplace, advProfile } = require('@middleware/access');

const { paginate, withSort } = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const negativeTargetValidation = require('./negativeTarget.validation');
const negativeTargetController = require('./negativeTarget.controller');

router.get(
  '/',
  validate(negativeTargetValidation.listNegativeTargetsRequests),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  negativeTargetController.listNegativeTargets
);

module.exports = router;
