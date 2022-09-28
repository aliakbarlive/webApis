const { pick, keys } = require('lodash');
const { Note } = require('../models');

/**
 * Get notes by accountId.
 *
 * @param uuid accountId
 * @param object data
 * @returns Note
 */
const getNotesByAccountId = async (accountId, query) => {
  const { filter, pageSize: limit, pageOffset: offset, sort } = query;

  const notes = await Note.findAndCountAll({
    where: {
      accountId,
      ...pick(filter, keys(Note.rawAttributes)),
    },
    limit,
    offset,
    order: sort,
  });

  return notes;
};

/**
 * Add note to accountId.
 *
 * @param uuid accountId
 * @param object data
 * @returns Note
 */
const addNoteToAccountId = async (accountId, data) => {
  const note = await Note.create({
    accountId,
    ...pick(data, keys(Note.rawAttributes)),
  });

  return note;
};

/**
 * Get note by accountId and noteIdl
 *
 * @param uuid accountId
 * @param object data
 * @returns Note
 */
const getNoteByAccountIdAndNoteId = async (accountId, noteId) => {
  const note = await Note.findOne({
    where: { accountId, noteId },
  });

  return note;
};

/**
 * Update note body.
 *
 * @param Note note
 * @param string body
 * @returns Note
 */
const updateNoteBody = async (note, body) => {
  note = await note.update({ body });
  return note;
};

/**
 * Delete note by accountId and noteIdl
 *
 * @param uuid accountId
 * @param int noteId
 * @returns boolean
 */
const deleteNoteByAccountIdAndNoteId = async (accountId, noteId) => {
  const deletedCount = await Note.destroy({
    where: { accountId, noteId },
  });

  return !!deletedCount;
};

module.exports = {
  updateNoteBody,
  addNoteToAccountId,
  getNotesByAccountId,
  getNoteByAccountIdAndNoteId,
  deleteNoteByAccountIdAndNoteId,
};
