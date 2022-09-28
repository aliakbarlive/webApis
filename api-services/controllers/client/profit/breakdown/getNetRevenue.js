const path = require('path');
const asyncHandler = require(path.resolve('.', 'middleware/async'));
const {
  getItemChargeBreakdown,
  getItemPromotionBreakdown,
  getItemWithheldTaxBreakdown,
  getItemChargeAdjustmentBreakdown,
  getItemTaxWithheldAdjustmentBreakdown,
  getItemPromotionAdjustmentBreakdown,
  totalSum,
  sumItems,
} = require(path.resolve('.', 'services/profit.service'));

// @desc      Get Net Revenue
// @route     GET /api/v1/profit/breakdown/net-revenue?startDate=2021-07-01&endDate=2021-07-31
// @access  Private
module.exports = asyncHandler(async (req, res, next) => {
  const itemChargeBreakdown = await getItemChargeBreakdown(req);
  const itemPromotionBreakdown = await getItemPromotionBreakdown(req);
  const itemWithheldTaxBreakdown = await getItemWithheldTaxBreakdown(req);

  const itemChargeAdjustmentBreakdown = await getItemChargeAdjustmentBreakdown(
    req
  );
  const itemTaxWithheldAdjustmentBreakdown =
    await getItemTaxWithheldAdjustmentBreakdown(req);
  const itemPromotionAdjustmentBreakdown =
    await getItemPromotionAdjustmentBreakdown(req);

  // Get the total sum of the item tables
  const itemChargeSubtotal = totalSum(itemChargeBreakdown);
  const itemPromotionSubtotal = totalSum(itemPromotionBreakdown);
  const itemWithheldTaxSubtotal = totalSum(itemWithheldTaxBreakdown);

  const itemChargeAdjustmentSubtotal = totalSum(itemChargeAdjustmentBreakdown);
  const itemTaxWithheldAdjustmentSubtotal = totalSum(
    itemTaxWithheldAdjustmentBreakdown
  );
  const itemPromotionAdjustmentSubtotal = totalSum(
    itemPromotionAdjustmentBreakdown
  );

  const totalReturns = parseFloat(
    (
      parseFloat(itemChargeAdjustmentSubtotal) +
      parseFloat(itemPromotionAdjustmentSubtotal)
    ).toFixed(2)
  );

  const returnsBreakdown = sumItems(
    itemChargeAdjustmentBreakdown,
    itemPromotionAdjustmentBreakdown
  );

  const totalTaxes = parseFloat(
    (
      parseFloat(itemWithheldTaxSubtotal) +
      parseFloat(itemTaxWithheldAdjustmentSubtotal)
    ).toFixed(2)
  );

  const taxesBreakdown = sumItems(
    itemWithheldTaxBreakdown,
    itemTaxWithheldAdjustmentBreakdown
  );

  res.status(200).json({
    success: true,
    data: {
      sales: {
        total: parseFloat(itemChargeSubtotal),
        breakdown: itemChargeBreakdown,
      },
      promotion: {
        total: parseFloat(itemPromotionSubtotal),
        breakdown: itemPromotionBreakdown,
      },
      returns: { total: parseFloat(totalReturns), breakdown: returnsBreakdown },
      taxes: { total: parseFloat(totalTaxes), breakdown: taxesBreakdown },
    },
  });
});
