const asyncHandler = require('@middleware/async');

const { updateItemOption } = require('./optimizationReportItemOption.service');

// @desc     Get optimization report items.
// @route    PUT /api/v1/ppc/optimizations/reports/:reportId/items/:itemId/options/:optionId
// @access   Private
exports.updateReportItemOption = asyncHandler(async (req, res, next) => {
  const { reportId, itemId, optionId } = req.params;

  const response = await updateItemOption(
    req.advProfile,
    reportId,
    itemId,
    optionId,
    req.body
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
    errors: response.errors,
  });
});
