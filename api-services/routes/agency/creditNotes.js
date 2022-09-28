const express = require('express');
const router = express.Router();

const {
  getCreditNote,
  createCreditNote,
  emailCreditNote,
  applyToInvoice,
  createCreditNoteRequest,
  patchCreditNoteRequest,
  getCreditNoteRequests,
  notifyHigherUps,
} = require('../../controllers/agency/creditNotes');

const { protect, authorize } = require('../../middleware/auth');
const { paginate, sortable } = require('../../middleware/advancedList');

router.post('/request', protect, createCreditNoteRequest);
router.post('/notify-higher-ups', protect, notifyHigherUps);
router.patch('/:creditNoteRequestId/update', protect, patchCreditNoteRequest);
router.post('/:creditNoteId/invoices', protect, applyToInvoice);
router.post('/:creditNoteId/email', protect, emailCreditNote);
router.get('/:creditNoteId', protect, getCreditNote);
router.get('/', protect, paginate, getCreditNoteRequests);
router.post('/', protect, createCreditNote);

module.exports = router;
