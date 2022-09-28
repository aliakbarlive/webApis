const asyncHandler = require('@middleware/async');
const zohoSubscription = require('../../utils/zohoSubscription');
const {
  getSubscription,
  getSubscriptionRecord,
} = require('../../services/subscription.service');
const {
  canComputeCommission,
  getCommissionsByAccountId,
} = require('../../services/commission.services');
const invoiceService = require('../../services/invoice.service');
const ErrorResponse = require('../../utils/errorResponse');
const { addZohoId } = require('../../services/agencyClient.service');
const {
  getInvoiceErrorsByInvoiceId,
} = require('../../services/invoiceError.service');
const syncInvoice = require('../../queues/invoices/sync/syncInvoice');

/**
 * invoice details webhook from zoho subscriptions
 */
// @desc     Consume invoice update webhook from Zoho Subscriptions
// @route    POST /api/v1/agency/invoice/syncdetails
// @access   PUBLIC
exports.syncDetails = asyncHandler(async (req, res) => {
  const { body } = req;
  try {
    if (body.data) {
      const { invoice } = body.data;
      await syncInvoice.add({ invoice, loaded: true });
    }
  } catch (err) {
    console.log(err);
  }

  res.status(200).end();
});

// @desc     Get All Invoices filtered by status and/or subscriptionId
// @route    POST /api/v1/agency/invoice?status={status}&subscriptionId={subscriptionId}&page={page}&per_page={per_page}
// @params   Allowed values for status: All, Sent, Pending, Draft, OverDue, Paid, PartiallyPaid, Void, Unpaid
// @access   Private
exports.getInvoices = asyncHandler(async (req, res, next) => {
  const { subscriptionId, zohoId, status, page, sizePerPage } = req.query;
  const { invoices, customview, page_context } =
    await invoiceService.getInvoices(
      status,
      page,
      sizePerPage,
      'number',
      subscriptionId,
      zohoId
    );

  res.status(200).json({
    success: true,
    data: {
      rows: invoices,
      page: page_context.page,
      sizePerPage: page_context.per_page,
      has_more_page: page_context.has_more_page,
    },
    customview,
  });
});

// @desc     Get Invoice Details
// @route    GET /api/v1/agency/invoice/{invoiceId}
// @access   Private
exports.getInvoice = asyncHandler(async (req, res, next) => {
  const {
    params: { invoiceId },
  } = req;

  const output = await invoiceService.getInvoice(invoiceId);

  const subscription =
    output.invoice.subscriptions.length > 0
      ? await getSubscription(output.invoice.subscriptions[0].subscription_id)
      : null;

  const subscriptionRecord = subscription
    ? await getSubscriptionRecord(
        output.invoice.subscriptions[0].subscription_id
      )
    : null;
  const commission = subscription
    ? await canComputeCommission(output.invoice.reference_id)
    : null;
  const commissionErrors = subscription
    ? await getInvoiceErrorsByInvoiceId(invoiceId)
    : null;
  const commissionData = subscription
    ? await getCommissionsByAccountId(output.invoice.reference_id)
    : null;

  res.status(200).json({
    success: true,
    output,
    subscription,
    subscriptionRecord,
    commission,
    commissionErrors,
    commissionData,
  });
});

exports.getAgencyClient = asyncHandler(async (req, res, next) => {
  const { invoiceId, zohoId } = req.params;

  const output = await invoiceService.resolveAgencyClient(invoiceId, zohoId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Add Usage/Metered Charges to Pending Invoice
// @route    POST /api/v1/agency/invoice/{invoiceId}/lineitems
// @access   Private
exports.addLineItems = asyncHandler(async (req, res, next) => {
  const {
    method,
    body,
    params: { invoiceId },
  } = req;

  const output = await zohoSubscription.callAPI({
    method,
    operation: `invoices/${invoiceId}/lineitems`,
    body,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete Line Item from Invoice
// @route    DELETE /api/v1/agency/invoice/{invoiceId}/lineitems/{itemId}
// @access   Private
exports.deleteLineItem = asyncHandler(async (req, res, next) => {
  const {
    params: { invoiceId, itemId },
    body: { reason },
  } = req;

  const output = await zohoSubscription.callAPI({
    method: 'DELETE',
    operation: `invoices/${invoiceId}/lineitems/${itemId}`,
    body: { reason },
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete Line Item Commision from Invoice
// @route    DELETE /api/v1/agency/invoice/{invoiceId}/lineitems/{itemId}/commission
// @access   Private
exports.deleteLineItemCommission = asyncHandler(async (req, res, next) => {
  const {
    method,
    params: { invoiceId, itemId },
  } = req;

  const output = await zohoSubscription.callAPI({
    method,
    operation: `invoices/${invoiceId}/lineitems/${itemId}`,
  });

  await zohoSubscription.callAPI({
    method: 'POST',
    operation: `invoices/${invoiceId}/customfields`,
    body: {
      custom_fields: [{ label: 'commission added', value: false }],
    },
  });

  await invoiceService.addInvoiceComment(
    invoiceId,
    `removed commission item ${itemId}`
  );

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Email Invoice
// @route    POST /api/v1/agency/invoice/{invoiceId}/email
// @access   Private
exports.emailInvoice = asyncHandler(async (req, res, next) => {
  const {
    method,
    params: { invoiceId },
    body: body_payload,
  } = req;

  const { to: to_mail_ids, cc: cc_mail_ids, subject, body } = body_payload;

  let callBody = {
    method,
    operation: `invoices/${invoiceId}/email`,
  };

  if (to_mail_ids) {
    callBody = {
      ...callBody,
      body: {
        to_mail_ids,
        cc_mail_ids,
        subject,
        body,
      },
    };
  }

  const output = await zohoSubscription.callAPI(callBody);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Bulk Email Invoices
// @route    POST /api/v1/agency/invoice/bulkemail
// @access   Private
exports.bulkEmail = asyncHandler(async (req, res, next) => {
  const {
    body: { payload },
  } = req;

  const invoiceSendQueue = require('../../queues/invoices/email/send');

  payload.map((invoice) => {
    return invoiceSendQueue.add({ invoice });
  });

  res.status(200).json({
    success: true,
    payload,
  });
});

// @desc     Collect Charge for Pending Invoice
// @route    POST /api/v1/agency/invoice/{invoiceId}/collect
// @access   Private
exports.collectCharge = asyncHandler(async (req, res, next) => {
  const {
    params: { invoiceId },
  } = req;

  const { invoice } = await invoiceService.getInvoice(invoiceId);

  const { cards } = await invoiceService.getCards(invoice.customer_id);

  if (!cards.length) {
    throw new ErrorResponse('No credit cards found on file', 402);
  }

  const collectCharge = await invoiceService.collectCharge(invoice, cards[0]);

  await invoiceService.addInvoiceComment(invoiceId, `${collectCharge.message}`);

  res.status(200).json({
    success: true,
    output: collectCharge,
  });
});

// @desc     Bulk Collect Charge Invoices
// @route    POST /api/v1/agency/invoice/bulkcollect
// @access   Private
exports.bulkCollectCharge = asyncHandler(async (req, res, next) => {
  const {
    body: { invoices },
  } = req;

  const collectQueue = require('../../queues/invoices/collect/charge');

  invoices.map((i) => {
    return collectQueue.add({
      invoiceId: i.invoiceId,
      invoiceNumber: i.number,
    });
  });

  res.status(200).json({
    success: true,
    invoices,
  });
});

// @desc     Record Manual Payment for invoice
// @route    POST /api/v1/agency/invoice/{invoiceId}/payments
// @access   Private
exports.recordPayment = asyncHandler(async (req, res, next) => {
  const {
    params: { invoiceId },
    body: {
      customer_id,
      amount,
      date,
      payment_mode,
      description,
      reference_number,
    },
  } = req;

  let payload = {
    customer_id,
    amount,
    date,
    payment_mode,
    description,
    invoices: [{ amount_applied: amount, invoice_id: invoiceId }],
    reference_number,
  };

  try {
    const output = await zohoSubscription.callAPI({
      method: 'POST',
      operation: `payments`,
      body: payload,
    });

    res.status(200).json({
      success: true,
      output: output.data && output.data.code == 0 ? output.data : output,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// @desc     Download PDF for invoice
// @route    GET /api/v1/agency/invoice/{invoiceId}/pdf
// @access   Private
exports.downloadPdf = asyncHandler(async (req, res, next) => {
  const {
    method,
    params: { invoiceId },
  } = req;

  const out = await zohoSubscription.callAPI({
    method,
    operation: `invoices/${invoiceId}?accept=pdf`,
  });

  res.contentType('application/pdf');
  res.send(out);
});

// @desc     Get Recent Activities of a specific invoice
// @route    GET /api/v1/agency/invoice/{invoiceId}/recentactivities
// @access   Private
exports.getRecentActivities = asyncHandler(async (req, res, next) => {
  const {
    params: { invoiceId },
  } = req;

  const output = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `invoices/${invoiceId}/recentactivities`,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Update Invoice Custom Field
// @route    POST /api/v1/agency/invoice/{invoiceId}/customfields
// @access   Private
exports.updateCustomField = asyncHandler(async (req, res, next) => {
  const { invoiceId } = req.params;
  const { label, value } = req.body;

  const output = await invoiceService.updateCustomField(
    invoiceId,
    label,
    value
  );

  await invoiceService.addInvoiceComment(
    invoiceId,
    `Updated custom field - ${label}: ${value} by ${req.user.firstName} ${req.user.lastName}`
  );

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Void Invoice
// @route    POST /api/v1/agency/invoice/{invoiceId}/void
// @access   Private
exports.voidInvoice = asyncHandler(async (req, res, next) => {
  const { invoiceId } = req.params;
  const output = await invoiceService.voidInvoice(invoiceId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Convert to Open Invoice/Undo Void
// @route    POST /api/v1/agency/invoice/{invoiceId}/converttoopen
// @access   Private
exports.convertToOpenInvoice = asyncHandler(async (req, res, next) => {
  const { invoiceId } = req.params;
  const output = await invoiceService.convertToOpen(invoiceId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Write Off Invoice
// @route    POST /api/v1/agency/invoice/{invoiceId}/writeoff
// @access   Private
exports.writeoffInvoice = asyncHandler(async (req, res, next) => {
  const { invoiceId } = req.params;
  const output = await invoiceService.writeoffInvoice(invoiceId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Cancel Write Off Invoice
// @route    POST /api/v1/agency/invoice/{invoiceId}/cancelwriteoff
// @access   Private
exports.cancelWriteoffInvoice = asyncHandler(async (req, res, next) => {
  const { invoiceId } = req.params;
  const output = await invoiceService.cancelWriteoffInvoice(invoiceId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Trigger Cron Email Queue manually
// @route    POST /api/v1/agency/invoice/cronEmail
// @access   Private
exports.testCronEmail = asyncHandler(async (req, res, next) => {
  const cronEmailQueue = require('../../queues/invoices/email/cron');

  cronEmailQueue.add();

  res.status(200).json({
    success: true,
  });
});

// @desc     Trigger Cron Collect Queue manually
// @route    POST /api/v1/agency/invoice/cronCollect
// @access   Private
exports.testCronCollect = asyncHandler(async (req, res, next) => {
  const cronCollectQueue = require('../../queues/invoices/collect/cron');

  cronCollectQueue.add({ status: 'Unpaid' });
  // cronCollectQueue.add({ status: 'Sent' });
  // cronCollectQueue.add({ status: 'OverDue' });

  res.status(200).json({
    success: true,
  });
});

// @desc     Trigger Cron Commission Queue manually
// @route    POST /api/v1/agency/invoice/cronCommission
// @access   Private
exports.testCronCommission = asyncHandler(async (req, res, next) => {
  const cronCommissionQueue = require('../../queues/invoices/commission/cron');

  cronCommissionQueue.add();

  res.status(200).json({
    success: true,
  });
});

exports.testCronCommissionSingle = asyncHandler(async (req, res, next) => {
  const { invoiceId, invoiceNumber, invoiceDate, accountId } = req.body;

  const cronCommissionComputeQueue = require('../../queues/invoices/commission/compute');

  cronCommissionComputeQueue.add({
    invoiceId,
    invoiceNumber,
    invoiceDate,
    accountId,
  });

  res.status(200).json({
    success: true,
  });
});
