const express = require('express');
const router = express.Router();

// Middlewares
const validate = require('../../middleware/validate');
const { protect } = require('../../middleware/auth.js');
const { account, marketplace } = require('../../middleware/access');
const {
  paginate,
  withFilters,
  withSort,
} = require('../../middleware/advancedList');

// Validations
const {
  addNoteRequest,
  getNoteRequest,
  updateNoteRequest,
  deleteNoteRequest,
  getNotesRequest,
} = require('../../validations/note.validation.js');

// Controllers
const {
  addNote,
  getNote,
  getNotes,
  updateNote,
  deleteNote,
} = require('../../controllers/client/note');

router.get(
  '/',
  validate(getNotesRequest),
  protect,
  account,
  paginate,
  withFilters,
  withSort,
  getNotes
);

router.post(
  '/',
  validate(addNoteRequest),
  protect,
  account,
  marketplace,
  addNote
);

router.put(
  '/:noteId',
  validate(updateNoteRequest),
  protect,
  account,
  updateNote
);

router.delete(
  '/:noteId',
  validate(deleteNoteRequest),
  protect,
  account,
  deleteNote
);

router.get('/:noteId', validate(getNoteRequest), protect, account, getNote);

module.exports = router;
