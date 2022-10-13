const asyncHandler = require('@middleware/async');

const { listAdGroupsByProfile } = require('./adGroup.service');

// @desc     List ad-groups.
// @route    GET /api/v1/advertising/ad-groups
// @access   Private
exports.listAdGroups = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listAdGroupsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
