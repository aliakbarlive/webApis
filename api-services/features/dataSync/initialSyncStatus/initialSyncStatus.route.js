const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');

const { paginate, withSort } = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const initialSyncStatusValidation = require('./initialSyncStatus.validation');
const initialSyncStatusController = require('./initialSyncStatus.controller');

router.get(
  '/',
  validate(initialSyncStatusValidation.listInitialSyncStatusRequest),
  authenticate(),
  paginate,
  withSort,
  initialSyncStatusController.listInitialSyncStatus
);

router.get(
  '/export',
  validate(initialSyncStatusValidation.exportInitialSyncStatusRequest),
  authenticate(),
  withSort,
  initialSyncStatusController.exportInitialSyncStatus
);

router.post(
  '/start',
  validate(initialSyncStatusValidation.startInitialSyncRequest),
  authenticate(),
  initialSyncStatusController.startInitialSync
);

module.exports = router;
