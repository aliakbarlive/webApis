const path = require('path');
const asyncHandler = require(path.resolve('.', 'middleware/async'));

const {
  getItemChargeByDate,
  getItemPromotionByDate,
  getItemWithheldTaxByDate,
  getItemChargeAdjustmentByDate,
  getItemTaxWithheldAdjustmentByDate,
  getItemPromotionAdjustmentByDate,
  getItemFeeByDate,
  getItemFeeAdjustmentByDate,
  getPPCAmountByDate,
  getCOGsByDate,
  sumItems,
  formatDate,
  prepareDate,
} = require(path.resolve('.', 'services/profit.service'));

// @desc      Get Metrics
// @route     GET /api/v1/profit/history/net-profit?startDate=2021-01-01&endDate=2021-07-31&view=weekly
// @access  Private
module.exports = asyncHandler(async (req, res, next) => {
  const { view } = req.query;

  const itemCharges = await getItemChargeByDate(req);
  const itemPromotions = await getItemPromotionByDate(req);
  const itemWithheldTaxes = await getItemWithheldTaxByDate(req);
  const itemFees = await getItemFeeByDate(req);
  const itemChargeAdjustments = await getItemChargeAdjustmentByDate(req);
  const itemTaxWithheldAdjustment = await getItemTaxWithheldAdjustmentByDate(
    req
  );
  const itemPromotionAdjustment = await getItemPromotionAdjustmentByDate(req);
  const itemFeeAdjustment = await getItemFeeAdjustmentByDate(req);
  const ppcSpend = await getPPCAmountByDate(req, 'cost');
  const cogs = await getCOGsByDate(req);

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
  const netRevenue = sumItems(sales, returns);

  // Fees
  const fees = sumItems(formatDate(itemFees), formatDate(itemFeeAdjustment));

  // Costs
  let costs = sumItems(formatDate(fees), formatDate(ppcSpend));
  costs = sumItems(costs, formatDate(cogs));

  // Net Profit
  const netProfit = prepareDate(sumItems(netRevenue, costs), view);

  res.status(200).json({
    success: true,
    data: netProfit,
  });
});
