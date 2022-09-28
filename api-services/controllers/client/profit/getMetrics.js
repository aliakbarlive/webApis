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
  getOrdersBreakdown,
  getCOGsBreakdown,
  totalSum,
} = require(path.resolve('.', 'services/profit.service'));
const { Op } = require('sequelize');

// @desc      Get Metrics
// @route     GET /api/v1/profit/metrics?startDate=2021-07-01&endDate=2021-07-31
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

  // PPC Sales
  const attributedSales14d = await getPPCAmount(req, 'attributedSales14d', {
    campaignType: 'sponsoredBrands',
  });
  const attributedSales30d = await getPPCAmount(req, 'attributedSales30d', {
    campaignType: {
      [Op.or]: ['sponsoredProducts', 'sponsoredDisplay'],
    },
  });
  const ppcSales = (
    parseFloat(attributedSales14d) + parseFloat(attributedSales30d)
  ).toFixed(2);

  // PPC Spend
  const ppcSpend = (-1 * (await getPPCAmount(req, 'cost'))).toFixed(2);

  // Orders
  const ordersBreakdown = await getOrdersBreakdown(req);
  const fbaOrderBreakdown = await getOrdersBreakdown(req, {
    fulfillmentChannel: 'AFN',
  });
  const fbmOrderBreakdown = await getOrdersBreakdown(req, {
    fulfillmentChannel: 'MFN',
  });
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

  // Promotions
  const promotions = (
    parseFloat(itemPromotionSubtotal) +
    parseFloat(itemPromotionAdjustmentSubtotal)
  ).toFixed(2);

  // Net Revenue = Sales - Refunds
  const netRevenue = (parseFloat(sales) + parseFloat(refunds)).toFixed(2);

  // Organic Sales = Sales - PPC Sales
  const organicSales = (parseFloat(sales) - parseFloat(ppcSales)).toFixed(2);

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

  const profitMargin = (parseFloat(netProfit) / parseFloat(netRevenue)).toFixed(
    4
  );
  const roi = (-1 * (parseFloat(netProfit) / parseFloat(cogs))).toFixed(4);

  const { totalOrders, totalUnits } = ordersBreakdown;

  res.status(200).json({
    success: true,
    data: {
      netProfit: parseFloat(netProfit),
      netRevenue: parseFloat(netRevenue),
      totalCost: parseFloat(totalCost),
      profitMargin: profitMargin !== 'NaN' ? parseFloat(profitMargin) : 0.0,
      roi: roi !== 'NaN' && roi !== '-Infinity' ? parseFloat(roi) : 0.0,
      organicSales: organicSales !== 'NaN' ? parseFloat(organicSales) : 0.0,
      ppcSales: ppcSales !== 'NaN' ? parseFloat(ppcSales) : 0.0,
      ppcSpend: parseFloat(ppcSpend),
      refunds: parseFloat(refunds),
      totalOrders: parseFloat(totalOrders),
      totalUnits: parseFloat(totalUnits),
      fbaOrders: parseFloat(fbaOrderBreakdown.totalOrders),
      fbmOrders: parseFloat(fbmOrderBreakdown.totalOrders),
      promotions,
      cogs,
    },
  });
});
