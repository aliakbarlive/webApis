const path = require('path');
const asyncHandler = require(path.resolve('.', 'middleware/async'));

const { getCOGsBreakdown, totalSum } = require(path.resolve(
  '.',
  'services/profit.service'
));

// @desc      Get Cost
// @route     GET /api/v1/profit/breakdown/roi?startDate=2021-07-01&endDate=2021-07-31
// @access  Private
module.exports = asyncHandler(async (req, res, next) => {
  const cogsBreakdown = await getCOGsBreakdown(req);

  const totalCogs = totalSum(cogsBreakdown);

  res.status(200).json({
    success: true,
    data: {
      cogs: {
        total: parseFloat(totalCogs),
      },
    },
  });
});
