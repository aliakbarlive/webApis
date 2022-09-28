const path = require('path');
const asyncHandler = require(path.resolve('.', 'middleware/async'));
const {
  getItemFeeBreakdown,
  getItemFeeAdjustmentBreakdown,
  getPPCAmount,
  getCOGsBreakdown,
  totalSum,
} = require(path.resolve('.', 'services/profit.service'));

// @desc      Get Cost
// @route     GET /api/v1/profit/breakdown/cost?startDate=2021-07-01&endDate=2021-07-31
// @access  Private
module.exports = asyncHandler(async (req, res, next) => {
  const itemFeeBreakdown = await getItemFeeBreakdown(req);
  const itemFeeAdjustmentBreakdown = await getItemFeeAdjustmentBreakdown(req);
  const itemFeeSubtotal = totalSum(itemFeeBreakdown);
  const itemFeeAdjustmentSubtotal = totalSum(itemFeeAdjustmentBreakdown);
  const cogsBreakdown = await getCOGsBreakdown(req);

  // Advertising Break down
  const ppcSpend = parseFloat(
    (-1 * (await getPPCAmount(req, 'cost'))).toFixed(2)
  );

  const sponsoredProducts = parseFloat(
    (
      -1 *
      (await getPPCAmount(req, 'cost', {
        campaignType: 'sponsoredProducts',
      }))
    ).toFixed(2)
  );

  const sponsoredDisplay = parseFloat(
    (
      -1 *
      (await getPPCAmount(req, 'cost', {
        campaignType: 'sponsoredDisplay',
      }))
    ).toFixed(2)
  );

  const sponsoredBrands = parseFloat(
    (
      -1 *
      (await getPPCAmount(req, 'cost', {
        campaignType: 'sponsoredBrands',
      }))
    ).toFixed(2)
  );

  // COGS breakdown
  const unitCosts = totalSum(cogsBreakdown, 'unitCosts');
  const shippingCosts = totalSum(cogsBreakdown, 'shippingCosts');
  const miscCosts = totalSum(cogsBreakdown, 'miscCosts');
  const totalCogs = totalSum(cogsBreakdown);

  res.status(200).json({
    success: true,
    data: {
      cogs: {
        total: totalCogs,
        breakdown: [
          { type: 'unitCosts', amount: parseFloat(unitCosts) },
          { type: 'shippingCosts', amount: parseFloat(shippingCosts) },
          { type: 'miscCosts', amount: parseFloat(miscCosts) },
        ],
      },
      fees: {
        total: itemFeeSubtotal,
        breakdown: itemFeeBreakdown,
      },
      advertising: {
        total: ppcSpend,
        breakdown: [
          { type: 'sponsoredProducts', amount: parseFloat(sponsoredProducts) },
          { type: 'sponsoredDisplay', amount: parseFloat(sponsoredDisplay) },
          { type: 'sponsoredBrands', amount: parseFloat(sponsoredBrands) },
        ],
      },
      returns: {
        total: itemFeeAdjustmentSubtotal,
        breakdown: itemFeeAdjustmentBreakdown,
      },
    },
  });
});
