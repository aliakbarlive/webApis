const asyncHandler = require('../../middleware/async');

const { getAdvPorfolios } = require('../../services/advPortfolio.service');

// @desc     Get Portfolios
// @route    GET /api/v1/ppc/portfolios
// @access   Private
exports.getAdvPortfolioList = asyncHandler(async (req, res, next) => {
  const { advProfile, query } = req;
  const data = await getAdvPorfolios(advProfile, query);

  res.status(200).json({
    success: true,
    data,
  });
});
