const asyncHandler = require('@middleware/async');
const ErrorResponse = require('@utils/errorResponse');
const {
  getInvoiceErrors,
  addInvoiceError,
  updateInvoiceError,
  getInvoiceErrorsNotNotified,
} = require('../../services/invoiceError.service');

// @desc     Get All Invoices filtered by status and/or subscriptionId
// @route    POST /api/v1/agency/invoice/errors
// @params   Allowed values for status: Pending, Resolved
// @access   Private
exports.getInvoiceErrors = asyncHandler(async (req, res, next) => {
  const { sort, page, pageSize, pageOffset, search, status } = req.query;

  const { count, rows } = await getInvoiceErrors({
    sort,
    page,
    pageSize,
    pageOffset,
    status,
    search,
  });

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
      search,
      status,
    },
  });
});

exports.addInvoiceError = asyncHandler(async (req, res, next) => {
  const {
    invoiceId,
    invoiceNumber,
    invoiceDate,
    accountId,
    status,
    description,
  } = req.body;

  const output = await addInvoiceError({
    invoiceId,
    invoiceNumber,
    invoiceDate,
    accountId,
    status,
    description,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

exports.updateInvoiceError = asyncHandler(async (req, res, next) => {
  const { errorId } = req.params;
  const { status } = req.body;

  const output = await updateInvoiceError(errorId, { status });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Get All Invoice Errors not notified
// @route    POST /api/v1/agency/invoice/errors/notifications
// @access   Private
exports.getInvoiceErrorsNotNotified = asyncHandler(async (req, res, next) => {
  const { count, rows } = await getInvoiceErrorsNotNotified();

  res.status(200).json({
    success: true,
    data: {
      count,
      rows,
    },
  });
});
