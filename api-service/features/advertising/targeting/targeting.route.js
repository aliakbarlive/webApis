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

const targetingValidation = require('./targeting.validation');
const targetingController = require('./targeting.controller');

router.get(
  '/',
  validate(targetingValidation.listTargetingsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  withDateRange,
  targetingController.listTargetings
);

router.get(
  '/conversions-summary',
  validate(targetingValidation.getTargetingsConversionSummaryRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withDateRange,
  targetingController.getTargetingConversionsSummary
);

router.get(
  '/distributions',
  validate(targetingValidation.getTargetingDistributionRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withDateRange,
  targetingController.getTargetingDistributions
);

module.exports = router;
