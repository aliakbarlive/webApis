const express = require('express');
const { getInvoiceErrors } = require('@controllers/agency/invoiceErrors');

const {
  getInvoice,
  addLineItems,
  deleteLineItem,
  getInvoices,
  emailInvoice,
  collectCharge,
  downloadPdf,
  recordPayment,
  getRecentActivities,
  bulkCollectCharge,
  bulkEmail,
  deleteLineItemCommission,
  updateCustomField,
  testCronEmail,
  testCronCollect,
  testCronCommission,
  testCronCommissionSingle,
  getAgencyClient,
} = require('@controllers/agency/invoices');

const { protect, authorize } = require('@middleware/auth');
const {
  addInvoiceError,
  updateInvoiceError,
  getInvoiceErrorsNotNotified,
} = require('../../controllers/agency/invoiceErrors');
const validate = require('@middleware/validate');
const {
  addInvoiceErrorRequest,
  updateInvoiceErrorRequest,
} = require('../../validations/invoiceError.validation');
const { paginate, withSort } = require('../../middleware/advancedList');
const {
  voidInvoice,
  writeoffInvoice,
  convertToOpenInvoice,
  cancelWriteoffInvoice,
  syncDetails,
} = require('../../controllers/agency/invoices');
const { zohoWebhook } = require('../../middleware/zohoWebhook');
const router = express.Router();

router.get('/', protect, getInvoices);
router.post('/bulkcollect', protect, bulkCollectCharge);
router.post('/bulkemail', protect, bulkEmail);
router.post('/cronEmail', protect, testCronEmail);
router.post('/cronCollect', protect, testCronCollect);
router.post('/cronCommission', protect, testCronCommission);
router.post('/cronCommissionSingle', protect, testCronCommissionSingle);
router.post('/syncdetails', zohoWebhook, syncDetails);

router.get('/errors', protect, paginate, withSort, getInvoiceErrors);
router.get('/errors/notifications', protect, getInvoiceErrorsNotNotified);
router.post(
  '/errors',
  validate(addInvoiceErrorRequest),
  protect,
  addInvoiceError
);
router.put(
  '/errors/:errorId',
  validate(updateInvoiceErrorRequest),
  protect,
  updateInvoiceError
);

//router.post('/invoice/new', newInvoice); //webhook for new invoice
router.get('/:invoiceId', protect, getInvoice);
router.post('/:invoiceId/lineitems', protect, addLineItems);
//router.delete('/:invoiceId/lineitems/:itemId', protect, deleteLineItem);
router.patch('/:invoiceId/lineitems/:itemId', protect, deleteLineItem);
router.delete(
  '/:invoiceId/lineitemscommission/:itemId',
  protect,
  deleteLineItemCommission
);
router.post('/:invoiceId/email', protect, emailInvoice);
router.post('/:invoiceId/collect', protect, collectCharge);
router.get('/:invoiceId/pdf', protect, downloadPdf);
router.post('/:invoiceId/payments', protect, recordPayment);
router.get('/:invoiceId/recentactivities', protect, getRecentActivities);
router.post('/:invoiceId/customfields', protect, updateCustomField);
router.post('/:invoiceId/void', protect, voidInvoice);
router.post('/:invoiceId/converttoopen', protect, convertToOpenInvoice);
router.post('/:invoiceId/writeoff', protect, writeoffInvoice);
router.post('/:invoiceId/cancelwriteoff', protect, cancelWriteoffInvoice);
router.get('/:invoiceId/customer/:zohoId', protect, getAgencyClient);

module.exports = router;
