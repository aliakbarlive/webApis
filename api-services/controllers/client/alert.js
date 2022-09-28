const ErrorResponse = require('../../utils/errorResponse');

const asyncHandler = require('../../middleware/async');
const {
  getAlertsByUserId,
  getAlertByIdAndUserId,
  getAlertableDetails,
  markAlertAsResolved,
  markAlertAsUnResolved,
} = require('../../services/alert.service');

// @desc     Get alert list.
// @route    GET /api/v1/alerts
// @access   Private
exports.getAlertList = asyncHandler(async (req, res, next) => {
  const { pageSize, page } = req.query;

  const { rows, count } = await getAlertsByUserId(req.user.userId, req.query);

  res.status(200).json({
    success: true,
    data: {
      rows,
      count,
      page,
      pageSize,
    },
  });
});

// @desc     Get alert details.
// @route    GET /api/v1/alerts/:alertId
// @access   Private
exports.getAlertDetails = asyncHandler(async (req, res, next) => {
  const { alertId } = req.params;
  const { userId } = req.user;

  const alert = await getAlertByIdAndUserId(alertId, userId, req.query, true);

  if (!alert) throw new ErrorResponse('Alert not found.', 404);

  await getAlertableDetails(alert);

  res.status(200).json({
    success: true,
    data: alert,
  });
});

// @desc     Mark alert as resolved.
// @route    POST /api/v1/alerts/:alertId/resolve
// @access   Private
exports.resolveAlert = asyncHandler(async (req, res, next) => {
  const { alertId } = req.params;
  const { userId } = req.user;

  const alert = await getAlertByIdAndUserId(alertId, userId, req.body);
  if (!alert) throw new ErrorResponse('Alert not found.', 404);

  await markAlertAsResolved(alert);

  res.status(200).json({
    success: true,
    data: alert,
  });
});

// @desc     Mark alert as unresolved.
// @route    POST /api/v1/alerts/:alertId/unresolve
// @access   Private
exports.unresolveAlert = asyncHandler(async (req, res, next) => {
  const { alertId } = req.params;
  const { userId } = req.user;

  const alert = await getAlertByIdAndUserId(alertId, userId, req.query);
  if (!alert) throw new ErrorResponse('Alert not found.', 404);

  await markAlertAsUnResolved(alert);

  res.status(200).json({
    success: true,
    data: alert,
  });
});
