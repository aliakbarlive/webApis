const asyncHandler = require('@middleware/async');

const { listReportItems } = require('./optimizationReportItem.service');

// @desc     Get optimization report items.
// @route    GET /api/v1/ppc/optimizations/reports/:reportId/items
// @access   Private
exports.listReportItems = asyncHandler(async (req, res, next) => {
  const response = await listReportItems(
    req.advProfile,
    req.params.reportId,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
