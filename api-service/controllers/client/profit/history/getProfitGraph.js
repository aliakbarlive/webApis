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
  getOrdersByDate,
  sumItems,
  formatDate,
  divideItems,
  prepareDate,
} = require(path.resolve('.', 'services/profit.service'));
const { Op } = require('sequelize');

// @desc      Get Metrics
// @route     GET /api/v1/profit/history/profit-graph?startDate=2021-01-01&endDate=2021-07-31&view=weekly
// @access  Private

module.exports = asyncHandler(async (req, res, next) => {
  const { view, filters } = req.query;

  const arrayFilter = filters.split(',');

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
  // PPC Sales
  const attributedSales14d = await getPPCAmountByDate(
    req,
    'attributedSales14d',
    {
      campaignType: 'sponsoredBrands',
    }
  );
  const attributedSales30d = await getPPCAmountByDate(
    req,
    'attributedSales30d',
    {
      campaignType: {
        [Op.or]: ['sponsoredProducts', 'sponsoredDisplay'],
      },
    }
  );

  const ppcSales = sumItems(
    formatDate(attributedSales14d),
    formatDate(attributedSales30d)
  );
  const ppcSpend = await getPPCAmountByDate(req, 'cost');

  // Cogs
  const cogs = await getCOGsByDate(req);

  // Orders
  const orders = await getOrdersByDate(req, 'amazonOrderId');
  const unitsSold = await getOrdersByDate(req, 'quantityOrdered');

  // Promotions
  let promotions = sumItems(
    formatDate(itemPromotions),
    formatDate(itemPromotionAdjustment)
  );

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
  const netProfit = sumItems(netRevenue, costs);

  // Net Profit By Date
  const netProfitByDate = prepareDate(netProfit, view);

  // Net Revenue By Date
  const netRevenueByDate = prepareDate(netRevenue, view);

  // Promotion By Date
  const promotionByDate = prepareDate(promotions, view);

  // Profit Margin By Date
  const profitMarginByDate = prepareDate(
    divideItems(netProfit, netRevenue, 1),
    view
  );

  // Refunds By Date
  const returnsByDate = prepareDate(returns, view);

  // Fees By Date
  const costsByDate = prepareDate(costs, view);

  // Cogs By Date
  const cogsByDate = prepareDate(cogs, view);

  // PPC By Date
  const ppcByDate = prepareDate(
    sumItems(formatDate(ppcSales), formatDate(ppcSpend)),
    view
  );
  const ordersByDate = prepareDate(formatDate(orders), view);
  const unitsSoldByDate = prepareDate(formatDate(unitsSold), view);

  let data = [];
  if (netProfitByDate) {
    netProfitByDate.map((d) => {
      const unitSoldIndex = unitsSoldByDate.findIndex((e) => e.date === d.date);
      const orderIndex = ordersByDate.findIndex((e) => e.date === d.date);
      const netRevenueIndex = netRevenueByDate.findIndex(
        (e) => e.date === d.date
      );
      const promotionIndex = promotionByDate.findIndex(
        (e) => e.date === d.date
      );
      const profitMarginIndex = profitMarginByDate.findIndex(
        (e) => e.date === d.date
      );
      const returnsIndex = returnsByDate.findIndex((e) => e.date === d.date);
      const costsIndex = costsByDate.findIndex((e) => e.date === d.date);
      const cogsIndex = cogsByDate.findIndex((e) => e.date === d.date);
      const ppcIndex = ppcByDate.findIndex((e) => e.date === d.date);

      let unitSold = {};
      let order = {};
      let netProfit = {};
      let netRevenue = {};
      let promotion = {};
      let profitMargin = {};
      let refund = {};
      let costs = {};
      let cogs = {};
      let ppc = {};

      if (arrayFilter.includes('unitSold')) {
        unitSold = {
          unitSoldAmount: unitsSoldByDate[unitSoldIndex]
            ? unitsSoldByDate[unitSoldIndex].amount
            : 0,
        };
      }

      if (arrayFilter.includes('order')) {
        order = {
          orderAmount: ordersByDate[orderIndex]
            ? ordersByDate[orderIndex].amount
            : 0,
        };
      }

      if (arrayFilter.includes('netProfit')) {
        netProfit = { netProfitAmount: d.amount };
      }

      if (arrayFilter.includes('netRevenue')) {
        netRevenue = {
          netRevenueAmount: netRevenueByDate[netRevenueIndex]
            ? netRevenueByDate[netRevenueIndex].amount
            : 0,
        };
      }

      if (arrayFilter.includes('promotion')) {
        promotion = {
          promotionAmount: promotionByDate[promotionIndex]
            ? promotionByDate[promotionIndex].amount
            : 0,
        };
      }

      if (arrayFilter.includes('profitMargin')) {
        profitMargin = {
          profitMarginAmount: profitMarginByDate[profitMarginIndex]
            ? profitMarginByDate[profitMarginIndex].amount
            : 0,
        };
      }
      if (arrayFilter.includes('refund')) {
        refund = {
          refundAmount: returnsByDate[returnsIndex]
            ? returnsByDate[returnsIndex].amount
            : 0,
        };
      }
      if (arrayFilter.includes('cost')) {
        costs = {
          costsAmount: costsByDate[costsIndex]
            ? costsByDate[costsIndex].amount
            : 0,
        };
      }
      if (arrayFilter.includes('cogs')) {
        cogs = {
          cogsAmount: cogsByDate[cogsIndex] ? cogsByDate[cogsIndex].amount : 0,
        };
      }
      if (arrayFilter.includes('ppc')) {
        ppc = {
          ppcAmount: ppcByDate[ppcIndex] ? ppcByDate[ppcIndex].amount : 0,
        };
      }

      data.push({
        date: d.date,
        ...unitSold,
        ...order,
        ...netProfit,
        ...netRevenue,
        ...promotion,
        ...profitMargin,
        ...refund,
        ...costs,
        ...cogs,
        ...ppc,
      });
    });
  }

  res.status(200).json({
    success: true,
    data,
  });
});
