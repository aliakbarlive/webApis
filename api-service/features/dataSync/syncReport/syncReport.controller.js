const asyncHandler = require('@middleware/async');

const {
  listSyncReports,
  retrySyncReportById,
} = require('./syncReport.service');

// @desc     List sync reports.
// @route    GET /api/v1/data-sync/reports
// @access   Private
exports.listSyncReports = asyncHandler(async (req, res, next) => {
  const response = await listSyncReports(req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Retry sync report.
// @route    GET /api/v1/data-sync/reports/:reportId/retry
// @access   Private
exports.retrySyncReport = asyncHandler(async (req, res, next) => {
  const response = await retrySyncReportById(req.params.reportId);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
