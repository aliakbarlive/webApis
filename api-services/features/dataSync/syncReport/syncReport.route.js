const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');

const { paginate, withSort } = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const syncReportValidation = require('./syncReport.validation');
const syncReportController = require('./syncReport.controller');

router.get(
  '/',
  validate(syncReportValidation.listSyncReportsRequest),
  authenticate(),
  paginate,
  withSort,
  syncReportController.listSyncReports
);

router.post(
  '/:reportId/retry',
  authenticate(),
  paginate,
  withSort,
  syncReportController.retrySyncReport
);

module.exports = router;
