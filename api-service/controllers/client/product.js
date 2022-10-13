const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

const {
  getGroupedProductsByAccountId,
  addJobToSaveProductsQueue,
} = require('../../services/product.service');

const {
  getListingsByAccountId,
  getListingByAccountIdAndAsin,
} = require('../../services/listing.service');

// @desc     List products
// @route    GET /api/v1/products
// @access   PRIVATE
exports.getProductList = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { page, pageSize } = req.query;

  const products = await getListingsByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: { ...products, page, pageSize },
  });
});

// @desc     List products
// @route    GET /api/v1/products/grouped
// @access   PRIVATE
exports.getGroupedProductList = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { page, pageSize } = req.query;

  const products = await getGroupedProductsByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: { ...products, page, pageSize },
  });
});

// @desc     Get product
// @route    GET /api/v1/products/:asin
// @access   PRIVATE
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;
  const { asin } = req.params;

  const product = await getListingByAccountIdAndAsin(accountId, asin, {
    marketplaceId,
  });

  if (!product) throw new ErrorResponse('Product not found.', 404);

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc     Webhook for RAINFOREST API
// @route    GET /api/v1/products/collection/receive
// @access   Public
exports.receiveProductCollection = asyncHandler(async (req, res) => {
  await addJobToSaveProductsQueue(req.body);

  res.status(200).end();
});
