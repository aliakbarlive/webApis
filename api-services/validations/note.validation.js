const Joi = require('joi');
const {
  requiresAccountAndMarketplace,
  listBaseValidation,
} = require('./base.validation');

const generateType = (parent) => {
  let type;
  if (parent.amazonOrderId) type = 'order';
  if (parent.inventoryItemId) type = 'inventoryItem';
  if (parent.reviewId) type = 'review';
  if (parent.asin) type = 'product';
  return type;
};

const generateIdentifier = (parent) => {
  let identifier;
  if (parent.amazonOrderId) identifier = parent.amazonOrderId;
  if (parent.inventoryItemId) identifier = parent.inventoryItemId;
  if (parent.reviewId) identifier = parent.reviewId;
  if (parent.asin) identifier = parent.asin;
  return identifier;
};

const addNoteRequest = {
  body: Joi.object()
    .keys({
      ...requiresAccountAndMarketplace,
      body: Joi.string().required(),
      amazonOrderId: Joi.string(),
      inventoryItemId: Joi.number(),
      reviewId: Joi.string(),
      asin: Joi.string(),
      type: Joi.string().default(generateType),
      identifier: Joi.string().default(generateIdentifier),
    })
    .xor('amazonOrderId', 'reviewId', 'inventoryItemId', 'asin'),
};

const getNotesRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    accountId: Joi.string().guid().required(),
    sort: Joi.string().default('createdAt'),
    amazonOrderId: Joi.string(),
    inventoryItemId: Joi.number(),
    reviewId: Joi.string(),
    asin: Joi.string(),
  }),
};

const getNoteRequest = {
  params: Joi.object().keys({
    noteId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    accountId: Joi.string().guid().required(),
  }),
};

const updateNoteRequest = {
  params: Joi.object().keys({
    noteId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    accountId: Joi.string().guid().required(),
    body: Joi.string().required(),
  }),
};

const deleteNoteRequest = {
  params: Joi.object().keys({
    noteId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    accountId: Joi.string().guid().required(),
  }),
};

module.exports = {
  addNoteRequest,
  getNoteRequest,
  updateNoteRequest,
  deleteNoteRequest,
  getNotesRequest,
};
