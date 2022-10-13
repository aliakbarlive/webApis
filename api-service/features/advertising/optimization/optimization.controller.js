const asyncHandler = require('@middleware/async');

const { listOptimizationsByProfileId } = require('./optimization.service');

// @desc     List optimizations.
// @route    GET /api/v1/ppc/optimizations
// @access   Private
exports.listOptimizations = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listOptimizationsByProfileId(
    advProfile.advProfileId,
    query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
