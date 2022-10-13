const asyncHandler = require('@middleware/async');

const { listProfilesByAccountId } = require('./profile.service');

// @desc     List profiles.
// @route    GET /api/v1/advertising/profiles
// @access   Private
exports.listProfiles = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;

  const response = await listProfilesByAccountId(accountId, req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
