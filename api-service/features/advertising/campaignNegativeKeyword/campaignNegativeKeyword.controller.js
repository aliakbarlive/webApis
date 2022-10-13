const asyncHandler = require('@middleware/async');

const {
  listCampaignNegativeKeywordsByProfile,
} = require('./campaignNegativeKeyword.service');

// @desc     List campaign negative keywords.
// @route    GET /api/v1/advertising/campaign-negative-keywords
// @access   Private
exports.listCampaignNegativeKeywords = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listCampaignNegativeKeywordsByProfile(
    advProfile,
    query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
