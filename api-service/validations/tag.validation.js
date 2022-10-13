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

const addTagRequest = {
  body: Joi.object()
    .keys({
      ...requiresAccountAndMarketplace,
      name: Joi.string().required(),
      amazonOrderId: Joi.string(),
      inventoryItemId: Joi.number(),
      reviewId: Joi.string(),
      asin: Joi.string(),
      type: Joi.string().default(generateType),
      identifier: Joi.string().default(generateIdentifier),
    })
    .xor('amazonOrderId', 'reviewId', 'inventoryItemId', 'asin'),
};

const getTagsRequest = {
  query: Joi.object().keys({
    ...listBaseValidation,
    ...requiresAccountAndMarketplace,
    amazonOrderId: Joi.string(),
    inventoryItemId: Joi.number(),
    reviewId: Joi.string(),
    asin: Joi.string(),
  }),
};

const updateTagRequest = {
  params: Joi.object().keys({
    tagId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
    name: Joi.string().required(),
  }),
};

const deleteTagRecordRequest = {
  params: Joi.object().keys({
    tagId: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      ...requiresAccountAndMarketplace,
      amazonOrderId: Joi.string(),
      inventoryItemId: Joi.number(),
      reviewId: Joi.string(),
      asin: Joi.string(),
    })
    .xor('amazonOrderId', 'reviewId', 'inventoryItemId', 'asin'),
};

const deleteTagRequest = {
  params: Joi.object().keys({
    tagId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    ...requiresAccountAndMarketplace,
  }),
};

module.exports = {
  addTagRequest,
  updateTagRequest,
  deleteTagRequest,
  getTagsRequest,
  deleteTagRecordRequest,
};
