const asyncHandler = require('../middleware/async');
const { Subscription } = require('../models');
const zohoSubscription = require('../utils/zohoSubscription');

// @desc     Get All Invoices filtered by status and subscriptionId
// @route    POST /api/v1/accounts/:accountId/invoices?page={page}&per_page={per_page}
// @access   Private
exports.getInvoices = asyncHandler(async (req, res, next) => {
  const { accountId } = req.params;
  const { page, sizePerPage } = req.query;

  const { subscriptionId } = await Subscription.findOne({
    where: { accountId },
  });

  const output = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `invoices?filter_by=Status.Paid&subscription_id=${subscriptionId}&page=${page}&per_page=${sizePerPage}&sort_column=number&sort_order=D`,
  });

  const {
    data: { invoices, page_context },
  } = output;

  res.status(200).json({
    success: true,
    data: {
      rows: invoices,
      page: page_context.page,
      sizePerPage: page_context.per_page,
      has_more_page: page_context.has_more_page,
    },
  });
});

// @desc     Get Invoice Details
// @route    GET /api/v1/accounts/:accountId/invoices/{invoiceId}
// @access   Private
exports.getInvoice = asyncHandler(async (req, res, next) => {
  const { invoiceId } = req.params;

  const output = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `invoices/${invoiceId}`,
  });

  res.status(200).json({
    success: true,
    output,
  });
});
