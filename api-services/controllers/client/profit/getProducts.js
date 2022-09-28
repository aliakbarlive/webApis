const path = require('path');
const asyncHandler = require(path.resolve('.', 'middleware/async'));
const { getProducts } = require(path.resolve('.', 'services/profit.service'));

// @desc      Get Products with Metrics
// @route     GET /api/v1/profit/products?startDate=2021-07-01&endDate=2021-07-31
module.exports = asyncHandler(async (req, res, next) => {
  const data = await getProducts(req);

  res.status(200).json({
    success: true,
    data,
  });
});
