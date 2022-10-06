const asyncHandler = require('../../middleware/async');
const { pick, keys } = require('lodash');

const {
  retrieveNote,
  createNote,
  applyToInvoice,
  getCreditNoteRequests,
} = require('../../services/creditNote.service');
const { sendEmailToHigherUps } = require('../../services/email.service');
const { CreditNote, AgencyClient, User, UserGroup } = require('../../models');

const { Op, col, where } = require('sequelize');

// * @desc     Get credit note from zoho subscription
// * @route    GET /api/v1/agency/credit-notes/:creditNoteId
// * @access   Private
exports.getCreditNote = asyncHandler(async (req, res, next) => {
  const { creditNoteId } = req.params;
  const data = await retrieveNote(creditNoteId);
  res.status(200).json({
    success: true,
    data,
  });
});

// * @desc     Create credit note for a customer
// * @route    POST /api/v1/agency/credit-notes
// * @access   Private
exports.createCreditNote = asyncHandler(async (req, res, next) => {
  const data = await createNote(req.body);

  res.status(200).json({
    success: true,
    data,
  });
});

// * @desc     Request creating credit note for a customer
// * @route    POST /api/v1/agency/credit-notes/request
// * @access   Private
exports.createCreditNoteRequest = asyncHandler(async (req, res, next) => {
  const payload = {
    status: 'pending', // default
    ...pick(req.body, keys(CreditNote.rawAttributes)),
  };

  const data = await CreditNote.create(payload);

  res.status(200).json({
    success: true,
    data,
  });
});

// * @desc     Update credit note for a customer
// * @route    PATCH /api/v1/agency/credit-notes/:creditNoteRequestId/update
// * @access   Private
exports.patchCreditNoteRequest = asyncHandler(async (req, res, next) => {
  const { creditNoteRequestId: creditNoteId } = req.params;
  const [data, created] = await CreditNote.upsert(
    { creditNoteId, ...pick(req.body, keys(CreditNote.rawAttributes)) },
    {
      returning: true,
    }
  );

  res.status(200).json({
    success: true,
    data,
  });
});

// * @desc     Request creating credit note for a customer
// * @route    GET /api/v1/agency/credit-notes
// * @access   Private
exports.getCreditNoteRequests = asyncHandler(async (req, res, next) => {
  const { page, pageSize, pageOffset } = req.query;

  const { count, rows } = await getCreditNoteRequests(req.query);

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      pageOffset,
      rows,
    },
  });
});

// * @desc     Email credit not to the customer
// * @route    POST /api/v1/agency/credit-notes/:creditNoteId/email
// * @access   Private
exports.emailCreditNote = asyncHandler(async (req, res, next) => {
  const { creditNoteId: noteId } = req.params;
  const creditNotsSendQueue = require('../../queues/creditNotes/email/send');
  creditNotsSendQueue.add({ noteId, body: req.body });
  res.status(200).json({
    success: true,
    noteId,
  });
});

// * @desc     Apply credit note to the invoices
// * @route    POST /api/v1/agency/credit-notes/:creditNoteId/invoices
// * @access   Private
exports.applyToInvoice = asyncHandler(async (req, res, next) => {
  const { creditNoteId } = req.params;
  const data = await applyToInvoice(creditNoteId, req.body);
  res.status(200).json({
    success: true,
    data,
  });
});

// * @desc     Notify Higher Ups
// * @route    POST /api/v1/agency/credit-notes/notify-higher-ups
// * @access   Private
exports.notifyHigherUps = asyncHandler(async (req, res, next) => {
  const { emails: email, clientName, requestor } = req.body;

  const subject = `Credit Note Request Created`;
  const message = `Requested by ${requestor.firstName} ${requestor.lastName} for the agency client: ${clientName}`;

  await sendEmailToHigherUps(email, subject, message);
  res.status(200).json({
    success: true,
  });
});
