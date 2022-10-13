const asyncHandler = require('@middleware/async');

const { listNegativeTargetsByProfile } = require('./negativeTarget.service');

// @desc     List negative targets.
// @route    GET /api/v1/advertising/negative-targets
// @access   Private
exports.listNegativeTargets = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listNegativeTargetsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
