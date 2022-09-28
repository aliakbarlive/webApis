const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

const {
  getOrdersByAccountId,
  getOrderByAccountIdAndAmazonOrderId,
  getOrdersSummaryByAccountId,
  getOrdersSummaryByAccountIdGroupByState,
} = require('../../services/order.service');

// @desc     Get orders summary
// @route    GET /api/v1/orders/summary
// @access   Private
exports.getOrdersSummary = asyncHandler(async (req, res) => {
  const { accountId } = req.account;

  const summary = await getOrdersSummaryByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: summary,
  });
});

// @desc     Get orders summary group by states
// @route    GET /api/v1/orders/states
// @access   Private
exports.getOrdersCountPerState = asyncHandler(async (req, res) => {
  const { accountId } = req.account;

  const summary = await getOrdersSummaryByAccountIdGroupByState(
    accountId,
    req.query
  );

  res.status(200).json({
    success: true,
    data: summary,
  });
});

// @desc     Get order list by accountId.
// @route    GET /api/v1/orders
// @access   Private
exports.getOrderList = asyncHandler(async (req, res) => {
  const { accountId } = req.account;
  const { pageSize, page } = req.query;

  const { count, rows } = await getOrdersByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: { count, rows, pageSize, page },
  });
});

// @desc     Get order details.
// @route    GET /api/v1/orders/:orderId
// @access   Private
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await getOrderByAccountIdAndAmazonOrderId(
    req.account.accountId,
    req.params.orderId,
    req.query,
    true
  );

  if (!order) throw new ErrorResponse('Order not found', 404);

  res.status(200).json({
    success: true,
    data: order,
  });
});
