const asyncHandler = require('@middleware/async');

const {
  getCampaignRecordsByProfile,
  getWeeklyCampaignRecordsByProfile,
  getCampaignPerformance,
} = require('./campaignRecord.service');

// @desc     Ger campaign records
// @route    GET /api/v1/ppc/campaigns/records
// @access   Private
exports.getCampaignRecords = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await getCampaignRecordsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Ger campaign records
// @route    GET /api/v1/ppc/campaigns/records
// @access   Private
exports.getWeeklyCampaignRecords = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await getWeeklyCampaignRecordsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Ger campaign records
// @route    GET /api/v1/ppc/campaigns/performance
// @access   Private
exports.getCampaignPerformance = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await getCampaignPerformance(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
