const moment = require('moment');
const { Parser } = require('json2csv');
const asyncHandler = require('@middleware/async');

const {
  startInitialSync,
  listInitialSyncStatus,
  exportInitialSyncStatus,
} = require('./initialSyncStatus.service');

// @desc     List initial sync status
// @route    GET /api/v1/data-sync/initial
// @access   Private
exports.listInitialSyncStatus = asyncHandler(async (req, res, next) => {
  const response = await listInitialSyncStatus(req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Export initial sync status
// @route    GET /api/v1/data-sync/initial/export
// @access   Private
exports.exportInitialSyncStatus = asyncHandler(async (req, res, next) => {
  const response = await exportInitialSyncStatus(req.query);

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(response.data);

  res.header('Content-Type', 'text/csv');
  res.attachment(
    `Initial Sync Status as of ${moment().format('YYYY-MM-DD')}.csv`
  );
  return res.send(csv);
});

// @desc     Start initial sync
// @route    POST /api/v1/data-sync/initial/start
// @access   Private
exports.startInitialSync = asyncHandler(async (req, res, next) => {
  const { accountIds, dataTypes } = req.body;
  const response = await startInitialSync(accountIds, dataTypes);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
  });
});
