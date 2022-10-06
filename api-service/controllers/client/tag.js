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
  getTagsByAccountId,
  addTagToAccountId,
  updateTagByAccountIdAndTagId,
  deleteTagByAccountIdAndTagId,
  getTagByAccountIdAndTagId,
  deleteTagRecordByTagId,
} = require('../../services/tag.service');
const { startCase } = require('lodash');

// @desc     Get tags.
// @route    GET /api/v1/tags
// @access   Private
exports.getTags = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { page, pageSize } = req.query;
  const { count, rows } = await getTagsByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: {
      page,
      pageSize,
      count,
      rows,
    },
  });
});

// @desc     Add tag.
// @route    POST /api/v1/tags
// @access   Private
exports.addTag = asyncHandler(async (req, res, next) => {
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

  if (!entity) throw new ErrorResponse(`${startCase(type)} not found`, 404);

  const tag = await addTagToAccountId(accountId, req.body);

  res.status(200).json({
    success: true,
    data: tag,
  });
});

// @desc     Update tag.
// @route    PUT /api/v1/tags
// @access   Private
exports.updateTag = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { tagId } = req.params;

  const tag = await updateTagByAccountIdAndTagId(accountId, tagId, req.body);

  if (!tag) throw new ErrorResponse('Tag not found', 404);

  res.status(200).json({
    success: true,
    message: 'Tag updated successfully',
  });
});

// @desc     Delete tag.
// @route    DELETE /api/v1/tags/:tagId
// @access   Private
exports.deleteTag = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { tagId } = req.params;

  const tag = await deleteTagByAccountIdAndTagId(accountId, tagId, req.body);

  if (!tag) throw new ErrorResponse('Tag not found', 404);

  res.status(200).json({
    success: true,
    message: 'Tag deleted successfully',
  });
});

// @desc     Delete tag record.
// @route    DELETE /api/v1/tags/:tagId/records
// @access   Private
exports.deleteTagRecord = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { tagId } = req.params;

  const tag = await getTagByAccountIdAndTagId(accountId, tagId, {
    marketplaceId,
  });

  if (!tag) throw new ErrorResponse('Tag not found', 404);

  const deleted = await deleteTagRecordByTagId(tagId, req.body);

  if (!deleted) throw new ErrorResponse('Tag Record not found', 404);

  res.status(200).json({
    success: true,
    message: 'Tag record deleted successfully',
  });
});
