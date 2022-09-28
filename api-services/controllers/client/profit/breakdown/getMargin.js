const path = require('path');
const asyncHandler = require(path.resolve('.', 'middleware/async'));

const {
  getItemChargeBreakdown,
  getItemFeeBreakdown,
  getItemPromotionBreakdown,
  getItemWithheldTaxBreakdown,
  getItemChargeAdjustmentBreakdown,
  getItemFeeAdjustmentBreakdown,
  getItemTaxWithheldAdjustmentBreakdown,
  getItemPromotionAdjustmentBreakdown,
  getPPCAmount,
  getCOGsBreakdown,
  totalSum,
} = require(path.resolve('.', 'services/profit.service'));

// @desc      Get Cost
// @route     GET /api/v1/profit/breakdown/margin?startDate=2021-07-01&endDate=2021-07-31
// @access  Private
module.exports = asyncHandler(async (req, res, next) => {
  const itemChargeBreakdown = await getItemChargeBreakdown(req);
  const itemFeeBreakdown = await getItemFeeBreakdown(req);
  const itemPromotionBreakdown = await getItemPromotionBreakdown(req);
  const itemWithheldTaxBreakdown = await getItemWithheldTaxBreakdown(req);
  const itemChargeAdjustmentBreakdown = await getItemChargeAdjustmentBreakdown(
    req
  );
  const itemFeeAdjustmentBreakdown = await getItemFeeAdjustmentBreakdown(req);
  const itemTaxWithheldAdjustmentBreakdown =
    await getItemTaxWithheldAdjustmentBreakdown(req);
  const itemPromotionAdjustmentBreakdown =
    await getItemPromotionAdjustmentBreakdown(req);

  // PPC Spend
  const ppcSpend = (-1 * (await getPPCAmount(req, 'cost'))).toFixed(2);

  const cogsBreakdown = await getCOGsBreakdown(req);

  // Get the total sum of the item tables
  const itemChargeSubtotal = totalSum(itemChargeBreakdown);
  const itemFeeSubtotal = totalSum(itemFeeBreakdown);
  const itemPromotionSubtotal = totalSum(itemPromotionBreakdown);
  const itemWithheldTaxSubtotal = totalSum(itemWithheldTaxBreakdown);
  const itemChargeAdjustmentSubtotal = totalSum(itemChargeAdjustmentBreakdown);
  const itemFeeAdjustmentSubtotal = totalSum(itemFeeAdjustmentBreakdown);
  const itemTaxWithheldAdjustmentSubtotal = totalSum(
    itemTaxWithheldAdjustmentBreakdown
  );
  const itemPromotionAdjustmentSubtotal = totalSum(
    itemPromotionAdjustmentBreakdown
  );

  // Sales
  const sales = (
    parseFloat(itemChargeSubtotal) +
    parseFloat(itemPromotionSubtotal) +
    parseFloat(itemWithheldTaxSubtotal)
  ).toFixed(2);

  // Refunds
  const refunds = (
    parseFloat(itemChargeAdjustmentSubtotal) +
    parseFloat(itemPromotionAdjustmentSubtotal) +
    parseFloat(itemTaxWithheldAdjustmentSubtotal)
  ).toFixed(2);

  // Net Revenue = Sales - Refunds
  const netRevenue = (parseFloat(sales) + parseFloat(refunds)).toFixed(2);

  // Total Cost = Total Item Fees + PPCSpend + Total COGS
  const totalCostItemFee =
    parseFloat(itemFeeSubtotal) + parseFloat(itemFeeAdjustmentSubtotal);
  const cogs = totalSum(cogsBreakdown);
  const totalCost = (
    totalCostItemFee +
    parseFloat(ppcSpend) +
    parseFloat(cogs)
  ).toFixed(2);

  // Net Profit = Net Revenue - Total Cost
  const netProfit = (parseFloat(netRevenue) + parseFloat(totalCost)).toFixed(2);

  res.status(200).json({
    success: true,
    data: {
      netProfit: {
        total: parseFloat(netProfit),
      },
      netRevenue: {
        total: parseFloat(netRevenue),
      },
    },
  });
});
