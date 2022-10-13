const asyncHandler = require('@middleware/async');

const { listKeywordsByProfile } = require('./keyword.service');

// @desc     List keywords.
// @route    GET /api/v1/advertising/keywords
// @access   Private
exports.listKeywords = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listKeywordsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
