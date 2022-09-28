const path = require('path');
const asyncHandler = require(path.resolve('.', 'middleware/async'));
const { getFeesBreakdownByProduct, totalSum } = require(path.resolve(
  '.',
  'services/profit.service'
));

// @desc      Get Product Fees
// @route     GET /api/v1/profit/breakdown/product/fees?startDate=2021-07-01&endDate=2021-07-31
// @access  Private
module.exports = asyncHandler(async (req, res, next) => {
  const data = await getFeesBreakdownByProduct(req);

  res.status(200).json({
    success: true,
    data,
  });
});
