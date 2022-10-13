const asyncHandler = require('@middleware/async');

const { listTargetsByProfile } = require('./target.service');

// @desc     List targets.
// @route    GET /api/v1/advertising/targets
// @access   Private
exports.listTargets = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listTargetsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
