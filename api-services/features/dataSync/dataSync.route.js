const express = require('express');
const router = express.Router();

const { initialSyncStatusRoute } = require('./initialSyncStatus');
const { syncRecordRoute } = require('./syncRecord');
const { syncReportRoute } = require('./syncReport');

router.use('/initial', initialSyncStatusRoute);
router.use('/records', syncRecordRoute);
router.use('/reports', syncReportRoute);

module.exports = router;
