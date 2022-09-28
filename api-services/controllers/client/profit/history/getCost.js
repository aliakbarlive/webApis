const path = require('path');
const asyncHandler = require(path.resolve('.', 'middleware/async'));

const {
  getItemFeeByDate,
  getItemFeeAdjustmentByDate,
  getPPCAmountByDate,
  getCOGsByDate,
  sumItems,
  formatDate,
  prepareDate,
} = require(path.resolve('.', 'services/profit.service'));

// @desc      Get Cost History
// @route     GET /api/v1/profit/history/cost?startDate=2021-01-01&endDate=2021-07-31&view=weekly
// @access  Private
module.exports = asyncHandler(async (req, res, next) => {
  const { view } = req.query;
  const itemFees = await getItemFeeByDate(req);
  const itemFeeAdjustment = await getItemFeeAdjustmentByDate(req);

  // PPC Spend
  const ppcSpend = await getPPCAmountByDate(req, 'cost');

  // Cogs
  const cogs = await getCOGsByDate(req);

  // Fees
  const fees = sumItems(formatDate(itemFees), formatDate(itemFeeAdjustment));

  // Costs
  let costs = sumItems(formatDate(fees), formatDate(ppcSpend));
  costs = prepareDate(sumItems(costs, formatDate(cogs)), view);

  res.status(200).json({
    success: true,
    data: costs,
  });
});
