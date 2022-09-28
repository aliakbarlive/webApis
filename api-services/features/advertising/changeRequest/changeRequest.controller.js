const asyncHandler = require('@middleware/async');

const {
  rejectChangeRequest,
  approveChangeRequest,
  getChangeRequestDetails,
  listChangeRequestsByUser,
} = require('./changeRequest.service');

// @desc     Get change request.
// @route    GET /api/v1/ppc/change-requests/:changeRequestId
// @access   Private
exports.getChangeRequest = asyncHandler(async (req, res, next) => {
  const { query, params } = req;
  const response = await getChangeRequestDetails(params.changeRequestId, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Get change requests
// @route    GET /api/v1/ppc/change-requests
// @access   Private
exports.listChangeRequests = asyncHandler(async (req, res, next) => {
  const response = await listChangeRequestsByUser(req.user, req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Approve change requests
// @route    POST /api/v1/ppc/change-requests/:changeRequestId/approve
// @access   Private
exports.approveChangeRequest = asyncHandler(async (req, res, next) => {
  const { changeRequestId } = req.params;
  const { items } = req.body;

  const response = await approveChangeRequest(req.user, changeRequestId, items);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Reject change requests
// @route    POST /api/v1/ppc/change-requests/:changeRequestId/reject
// @access   Private
exports.rejectChangeRequest = asyncHandler(async (req, res, next) => {
  const { changeRequestId } = req.params;
  const { items } = req.body;

  const response = await rejectChangeRequest(req.user, changeRequestId, items);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
  });
});
