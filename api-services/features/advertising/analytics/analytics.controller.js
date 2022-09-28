const asyncHandler = require('@middleware/async');

const {
  getProfileFunnel,
  getCampaignTypesSummary,
  getPerformanceByProfile,
  getKeywordsDistributionByProfile,
  getPerformanceByAccountAndProfile,
  getChangesByProfileAndCampaigns,
  getChangesByProfileAndProducts,
  getChangesByProfileAndKeywords,
  getProfilePerformanceByCampaignTypes,
  getProfilePerformanceByTargetingTypes,
  getKeywordConvertersSummary,
  getPerformanceByGranularity,
} = require('./analytics.service');

exports.getKeywordsDistribution = asyncHandler(async (req, res, next) => {
  const response = await getKeywordsDistributionByProfile(
    req.advProfile,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get overall performance.
// @route    GET /api/v1/ppc/analytics/overall
// @access   Private
exports.getOverallPerformance = asyncHandler(async (req, res, next) => {
  const response = await getPerformanceByAccountAndProfile(
    req.account,
    req.advProfile,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get campaign types performance.
// @route    GET /api/v1/ppc/analytics/:granularity
// @access   Private
exports.getPerformanceByGranularity = asyncHandler(async (req, res, next) => {
  const response = await getPerformanceByGranularity(
    req.account,
    req.advProfile,
    req.params.granularity,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get profile performance.
// @route    GET /api/v1/ppc/analytics/performance
// @access   Private
exports.getProfilePerformance = asyncHandler(async (req, res, next) => {
  const response = await getPerformanceByProfile(req.advProfile, req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get campaign types performance.
// @route    GET /api/v1/ppc/analytics/funnel
// @access   Private
exports.getFunnel = asyncHandler(async (req, res, next) => {
  const response = await getProfileFunnel(req.advProfile, req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get changes by productAds
// @route    GET /api/v1/ppc/analytics/campaign-types/summary
// @access   Private
exports.getCampaignTypesSummary = asyncHandler(async (req, res, next) => {
  const response = await getCampaignTypesSummary(req.advProfile, req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get campaign types performance.
// @route    GET /api/v1/ppc/analytics/campaign-types/performance
// @access   Private
exports.getCampaignTypesPerformance = asyncHandler(async (req, res, next) => {
  const response = await getProfilePerformanceByCampaignTypes(
    req.advProfile,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get targeting types performance.
// @route    GET /api/v1/ppc/analytics/targeting-types/performance
// @access   Private
exports.getTargetingTypesPerformance = asyncHandler(async (req, res, next) => {
  const response = await getProfilePerformanceByTargetingTypes(
    req.advProfile,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get changes by campaigns
// @route    GET /api/v1/ppc/analytics/campaign-changes
// @access   Private
exports.getChangesByCampaigns = asyncHandler(async (req, res, next) => {
  const response = await getChangesByProfileAndCampaigns(
    req.advProfile,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get changes by productAds
// @route    GET /api/v1/ppc/analytics/product-changes
// @access   Private
exports.getChangesByProducts = asyncHandler(async (req, res, next) => {
  const response = await getChangesByProfileAndProducts(
    req.advProfile,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get changes by productAds
// @route    GET /api/v1/ppc/analytics/keyword-changes
// @access   Private
exports.getChangesByKeywords = asyncHandler(async (req, res, next) => {
  const response = await getChangesByProfileAndKeywords(
    req.advProfile,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get changes by productAds
// @route    GET /api/v1/ppc/analytics/keyword-converters-summary
// @access   Private
exports.getKeywordConvertersSummary = asyncHandler(async (req, res, next) => {
  const response = await getKeywordConvertersSummary(req.advProfile, req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
