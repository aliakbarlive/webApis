const asyncHandler = require('@middleware/async');

const {
  generateOptimizationReport,
  processOptimizationReport,
  getOptimizationReport,
} = require('./optimizationReport.service');

// @desc     Generate optimization report.
// @route    POST /api/v1/ppc/optimizations/reports
// @access   Private
exports.createOptimizationReport = asyncHandler(async (req, res, next) => {
  const { user, advProfile, body } = req;

  const response = await generateOptimizationReport(user, advProfile, body);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get optimization report.
// @route    GET /api/v1/ppc/optimizations/reports/:reportId
// @access   Private
exports.getOptimizationReport = asyncHandler(async (req, res, next) => {
  const { advProfile } = req;
  const { reportId } = req.params;

  const response = await getOptimizationReport(advProfile, reportId, req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Process optimization report.
// @route    POST /api/v1/ppc/optimizations/reports/:reportId/process
// @access   Private
exports.processOptimizationReport = asyncHandler(async (req, res, next) => {
  const { user, advProfile } = req;
  const { reportId } = req.params;

  const response = await processOptimizationReport(user, advProfile, reportId);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
