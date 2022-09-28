const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');

const {
  getReviewByAccountIdAndReviewId,
} = require('../../services/review.service');

const {
  getInventoryByAccountIdAndId,
} = require('../../services/inventory.service');

const {
  getProductByAccountIdAndAsin,
} = require('../../services/product.service');

const {
  getOrderByAccountIdAndAmazonOrderId,
} = require('../../services/order.service');

const {
  addNoteToAccountId,
  getNoteByAccountIdAndNoteId,
  updateNoteBody,
  deleteNoteByAccountIdAndNoteId,
  getNotesByAccountId,
} = require('../../services/note.service');

// @desc     Get notes.
// @route    GET /api/v1/notes
// @access   Private
exports.getNotes = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { pageSize, page } = req.query;

  const { count, rows } = await getNotesByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: { page, pageSize, count, rows },
  });
});

// @desc     Add note.
// @route    POST /api/v1/notes
// @access   Private
exports.addNote = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { type, identifier } = req.body;

  const methods = {
    product: getProductByAccountIdAndAsin,
    review: getReviewByAccountIdAndReviewId,
    inventoryItem: getInventoryByAccountIdAndId,
    order: getOrderByAccountIdAndAmazonOrderId,
  };

  const entity = await methods[type](accountId, identifier, { marketplaceId });

  if (!entity) throw new ErrorResponse('Entity not found', 404);

  const note = await addNoteToAccountId(accountId, req.body);

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc     Get note.
// @route    GET /api/v1/notes/:noteId
// @access   Private
exports.getNote = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { noteId } = req.params;

  const note = await getNoteByAccountIdAndNoteId(accountId, noteId);

  if (!note) throw new ErrorResponse('Note not found', 404);

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc     Update note.
// @route    PUT /api/v1/notes/:noteId
// @access   Private
exports.updateNote = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { noteId } = req.params;

  let note = await getNoteByAccountIdAndNoteId(accountId, noteId);

  if (!note) throw new ErrorResponse('Note not found', 404);

  note = await updateNoteBody(note, req.body.body);

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc     Update note.
// @route    DELETE /api/v1/notes/:noteId
// @access   Private
exports.deleteNote = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { noteId } = req.params;

  const deleted = await deleteNoteByAccountIdAndNoteId(accountId, noteId);

  if (!deleted) throw new ErrorResponse('Note not found', 404);

  res.status(200).json({
    success: true,
  });
});
