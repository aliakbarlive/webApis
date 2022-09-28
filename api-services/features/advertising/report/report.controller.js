const asyncHandler = require('@middleware/async');

const {
  createReport,
  getReportById,
  listReportByProfile,
} = require('./report.service');

const {
  listTargetingsByProfile,
  getTargetingsDistributionByProfile,
} = require('../targeting/targeting.service');

// @desc     List Reports
// @route    GET /api/v1/advertising/reports
// @access   Private
exports.listReports = asyncHandler(async (req, res, next) => {
  const response = await listReportByProfile(req.advProfile, req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Create Report
// @route    POST /api/v1/advertising/reports
// @access   Private
exports.createReport = asyncHandler(async (req, res, next) => {
  const { advProfileId, accountId } = req.advProfile;
  const { userId: generatedByUserId } = req.user;

  const response = await createReport({
    ...req.body,
    accountId,
    advProfileId,
    generatedByUserId,
  });

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get Report
// @route    GET /api/v1/advertising/reports/:reportId
// @access   Private
exports.getReport = asyncHandler(async (req, res, next) => {
  const response = await getReportById(req.params.reportId);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get Report
// @route    GET /api/v1/advertising/reports/:reportId/targetings-distribution
// @access   Private
exports.getReportTargetingDistribution = asyncHandler(
  async (req, res, next) => {
    let response = await getReportById(req.params.reportId);

    const { startDate, endDate, advProfile } = response.data;

    response = await getTargetingsDistributionByProfile(advProfile, {
      dateRange: { startDate, endDate },
      attribute: req.query.attribute,
    });

    res.status(response.code).json({
      success: response.status,
      message: response.message,
      data: response.data,
    });
  }
);

// @desc     Get Report
// @route    GET /api/v1/advertising/reports/:reportId/targetings
// @access   Private
exports.getReportTargetings = asyncHandler(async (req, res, next) => {
  let response = await getReportById(req.params.reportId);

  const { startDate, endDate, advProfile } = response.data;

  response = await listTargetingsByProfile(advProfile, {
    dateRange: { startDate, endDate },
    ...req.query,
  });

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
