const asyncHandler = require('@middleware/async');

const { listProductsByProfile } = require('./productAd.service');

// @desc     List products.
// @route    GET /api/v1/advertising/product-ads/products
// @access   Private
exports.listProducts = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;

  const response = await listProductsByProfile(advProfile, query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});
