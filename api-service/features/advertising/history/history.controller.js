const asyncHandler = require('@middleware/async');

const {
  listHistoryByProfileId,
  getGroupedHistoryByProfileId,
} = require('./history.service');

// @desc     Get grouped history
// @route    GET /api/v1/advertising/history/grouped
// @access   Private
exports.getGroupedHistory = asyncHandler(async (req, res, next) => {
  const response = await getGroupedHistoryByProfileId(
    req.advProfile.advProfileId,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     List history
// @route    GET /api/v1/advertising/history
// @access   Private
exports.listHistory = asyncHandler(async (req, res, next) => {
  const response = await listHistoryByProfileId(
    req.advProfile.advProfileId,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
