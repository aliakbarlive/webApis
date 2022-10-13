const asyncHandler = require('@middleware/async');

const {
  updateSingleCampaign,
  listCampaignsByProfile,
  applyCampaignsRecommendedBudget,
} = require('./campaign.service');

// @desc     List campaigns.
// @route    GET /api/v1/ppc/campaigns
// @access   Private
exports.listCampaigns = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listCampaignsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Update campaign.
// @route    PUT /api/v1/ppc/campaigns/:campaignId
// @access   Private
exports.updateCampaign = asyncHandler(async (req, res, next) => {
  const { campaignId } = req.params;

  const response = await updateSingleCampaign(
    req.user,
    req.advProfile,
    campaignId,
    req.body.data
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Apply campaign recommended budget.
// @route    POST /api/v1/ppc/campaigns/apply-recommended-budget
// @access   Private
exports.applyRecommendedBudget = asyncHandler(async (req, res, next) => {
  const response = await applyCampaignsRecommendedBudget(
    req.user,
    req.advProfile,
    req.body
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
