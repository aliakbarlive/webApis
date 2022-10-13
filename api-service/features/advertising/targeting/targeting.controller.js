const asyncHandler = require('@middleware/async');
const {
  listTargetingsByProfile,
  getConvertersSummary,
  getTargetingsDistributionByProfile,
} = require('./targeting.service');

// @desc     List targets.
// @route    GET /api/v1/advertising/targetings
// @access   Private
exports.listTargetings = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listTargetingsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get targeting converters summary
// @route    GET /api/v1/ppc/targetings/conversions-summary
// @access   Private
exports.getTargetingConversionsSummary = asyncHandler(
  async (req, res, next) => {
    const response = await getConvertersSummary(req.advProfile, req.query);

    res.status(response.code).json({
      success: response.status,
      message: response.message,
      data: response.data,
    });
  }
);

// @desc     Get targeting converters summary
// @route    GET /api/v1/ppc/targetings/distributions
// @access   Private
exports.getTargetingDistributions = asyncHandler(async (req, res, next) => {
  const response = await getTargetingsDistributionByProfile(
    req.advProfile,
    req.query
  );

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
