const asyncHandler = require('@middleware/async');

const {
  listSyncRecords,
  getSyncReportById,
  initSyncRecordsCron,
} = require('./syncRecord.service');

// @desc     List sync records
// @route    GET /api/v1/data-sync/records
// @access   Private
exports.listSyncRecords = asyncHandler(async (req, res, next) => {
  const response = await listSyncRecords(req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get sync record.
// @route    GET /api/v1/data-sync/records/:syncRecordId
// @access   Private
exports.getSyncRecord = asyncHandler(async (req, res, next) => {
  const { syncRecordId } = req.params;

  const response = await getSyncReportById(syncRecordId, req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Initialize Cron sync records
// @route    GET /api/v1/data-sync/records/init-cron
// @access   Private
exports.initSyncRecordsCron = asyncHandler(async (req, res, next) => {
  const response = await initSyncRecordsCron(req.body.dataType);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
  });
});
