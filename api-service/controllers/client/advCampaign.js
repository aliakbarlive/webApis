const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');

const {
  getAdvCampaigns,
  getAdvCampaignRecords,
  getAdvCampaignById,
  getAdvCampaignStatistics,
} = require('../../services/advCampaign.service');

// @desc     Get campaign list.
// @route    GET /api/v1/ppc/campaigns
// @access   Private
exports.getCampaignList = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;

  const data = await getAdvCampaigns(advProfileId, req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Get all campaign records.
// @route    GET /api/v1/ppc/campaigns/records
// @access   Private
exports.getAllCampaignRecords = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;

  const data = await getAdvCampaignRecords(advProfileId, req.query);

  return res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Get all campaign statisctics.
// @route    GET /api/v1/ppc/campaigns/statisctics
// @access   Private
exports.getAllCampaignStatistics = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;
  const data = await getAdvCampaignStatistics(advProfileId, req.query);

  return res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Get campaign details.
// @route    GET /api/v1/ppc/campaigns/:advCampaignId
// @access   Private
exports.getCampaignDetails = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;
  const { advCampaignId } = req.params;

  const advCampaign = await getAdvCampaignById(
    advProfileId,
    advCampaignId,
    true
  );

  if (!advCampaign) {
    throw new ErrorResponse('Advertising Campaign not found', 404);
  }

  res.status(200).json({
    success: true,
    data: advCampaign,
  });
});

// @desc     Get campaign details.
// @route    GET /api/v1/ppc/campaigns/:advCampaignId/statistics
// @access   Private
exports.getCampaignStatistics = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;
  const { advCampaignId } = req.params;
  let { query } = req;

  const advCampaign = await getAdvCampaignById(advProfileId, advCampaignId);

  if (!advCampaign) {
    throw new ErrorResponse('Advertising Campaign not found', 404);
  }

  query.filter.campaignType = advCampaign.campaignType;
  query.filter.advCampaignId = advCampaign.advCampaignId;
  const statistics = await getAdvCampaignStatistics(advProfileId, query);

  res.status(200).json({
    success: true,
    data: statistics,
  });
});

// @desc     Get campaign records.
// @route    GET /api/v1/ppc/campaigns/:advCampaignId/records
// @access   Private
exports.getCampaignRecords = asyncHandler(async (req, res, next) => {
  const { advProfileId } = req.advProfile;
  const { advCampaignId } = req.params;

  const advCampaign = await getAdvCampaignById(advProfileId, advCampaignId);

  if (!advCampaign) {
    throw new ErrorResponse('Advertising Campaign not found', 404);
  }

  req.query.filter.advCampaignId = advCampaignId;

  const data = await getAdvCampaignRecords(
    req.advProfile.advProfileId,
    req.query
  );

  res.status(200).json({
    success: true,
    data,
  });
});
