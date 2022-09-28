const asyncHandler = require('@middleware/async');

const { listNegativeKeywordsByProfile } = require('./negativeKeyword.service');

// @desc     List negative keywords.
// @route    GET /api/v1/advertising/negative-keywords
// @access   Private
exports.listNegativeKeywords = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listNegativeKeywordsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
