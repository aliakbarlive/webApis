const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');

const { paginate, withSort } = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const syncRecordValidation = require('./syncRecord.validation');
const syncRecordController = require('./syncRecord.controller');

router.get(
  '/',
  validate(syncRecordValidation.listSyncRecordsRequest),
  authenticate(),
  paginate,
  withSort,
  syncRecordController.listSyncRecords
);

router.get(
  '/:syncRecordId',
  validate(syncRecordValidation.getSyncRecordRequest),
  authenticate(),
  syncRecordController.getSyncRecord
);

router.post(
  '/init-cron',
  validate(syncRecordValidation.initSyncRecordsCronRequest),
  authenticate(),
  syncRecordController.initSyncRecordsCron
);

module.exports = router;
