const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const { paginate, withSort } = require('@middleware/advancedList');
const { account, marketplace, advProfile } = require('@middleware/access');

const validate = require('@middleware/validate');

const reportValidation = require('./report.validation');
const reportController = require('./report.controller');

router.get(
  '/',
  validate(reportValidation.listReportsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  reportController.listReports
);

router.post(
  '/',
  validate(reportValidation.createReportRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  reportController.createReport
);

router.get(
  '/:reportId',
  validate(reportValidation.getReportRequest),
  reportController.getReport
);

router.get(
  '/:reportId/targetings',
  validate(reportValidation.getReportTargetingsRequest),
  paginate,
  withSort,
  reportController.getReportTargetings
);

router.get(
  '/:reportId/targetings-distribution',
  validate(reportValidation.getReportTargetingDistributionRequest),
  reportController.getReportTargetingDistribution
);

module.exports = router;
