const path = require('path');
const asyncHandler = require(path.resolve('.', 'middleware/async'));

const {
  getItemChargeByDate,
  getItemPromotionByDate,
  getItemWithheldTaxByDate,
  getItemChargeAdjustmentByDate,
  getItemTaxWithheldAdjustmentByDate,
  getItemPromotionAdjustmentByDate,
  sumItems,
  formatDate,
  prepareDate,
} = require(path.resolve('.', 'services/profit.service'));

// @desc      Get Metrics
// @route     GET /api/v1/profit/history/net-revenue?startDate=2021-01-01&endDate=2021-07-31&view=weekly
// @access  Private
module.exports = asyncHandler(async (req, res, next) => {
  const { view } = req.query;

  const itemCharges = await getItemChargeByDate(req);
  const itemPromotions = await getItemPromotionByDate(req);
  const itemWithheldTaxes = await getItemWithheldTaxByDate(req);
  const itemChargeAdjustments = await getItemChargeAdjustmentByDate(req);
  const itemTaxWithheldAdjustment = await getItemTaxWithheldAdjustmentByDate(
    req
  );
  const itemPromotionAdjustment = await getItemPromotionAdjustmentByDate(req);

  // Sales
  let sales = sumItems(formatDate(itemCharges), formatDate(itemPromotions));
  sales = sumItems(formatDate(sales), formatDate(itemWithheldTaxes));

  // Returns
  let returns = sumItems(
    formatDate(itemChargeAdjustments),
    formatDate(itemTaxWithheldAdjustment)
  );
  returns = sumItems(formatDate(returns), formatDate(itemPromotionAdjustment));

  // Net Revenue
  const netRevenue = prepareDate(sumItems(sales, returns), view);

  res.status(200).json({
    success: true,
    data: netRevenue,
  });
});
