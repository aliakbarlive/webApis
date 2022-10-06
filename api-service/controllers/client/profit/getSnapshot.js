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
  sumItems,
} = require(path.resolve('.', 'services/profit.service'));
const { Op } = require('sequelize');

// @desc      Get Metrics
// @route     GET /api/v1/profit/snapshot?startDate=2021-07-01&endDate=2021-07-31
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

  // COGs
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

  const margin = (parseFloat(netProfit) / parseFloat(netRevenue)).toFixed(4);
  const roi = (-1 * (parseFloat(netProfit) / parseFloat(cogs))).toFixed(4);

  const { totalOrders: orders, totalUnits: units } = ordersBreakdown;

  // Revenue
  let revenue = sumItems(itemChargeBreakdown, itemPromotionBreakdown);
  revenue = sumItems(revenue, itemWithheldTaxBreakdown);

  // Fees
  const fees = itemFeeBreakdown;

  // Advertising
  const advertising = [
    {
      type: 'Sales',
      amount: ppcSales !== 'NaN' ? parseFloat(ppcSales) : 0.0,
    },
    {
      type: 'Spend',
      amount: parseFloat(ppcSpend),
    },
  ];

  // Returns
  const r1 = sumItems(
    itemChargeAdjustmentBreakdown,
    itemFeeAdjustmentBreakdown
  );
  const r2 = sumItems(
    itemTaxWithheldAdjustmentBreakdown,
    itemPromotionAdjustmentBreakdown
  );
  const returns = sumItems(r1, r2);

  res.status(200).json({
    success: true,
    data: {
      orders,
      units: units !== null ? units : 0,
      revenue,
      cogs: parseFloat(cogs),
      fees,
      advertising,
      returns,
      netProfit: parseFloat(netProfit),
      margin: margin !== 'NaN' ? parseFloat(margin) : 0,
      roi:
        roi !== 'NaN' && roi !== '-Infinity' && roi !== 'Infinity'
          ? parseFloat(roi)
          : 0,
    },
  });
});
