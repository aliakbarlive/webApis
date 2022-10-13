const asyncHandler = require('../../middleware/async');
const { Marketplace } = require('../../models');

// @desc     Get Marketplaces
// @route    GET /api/v1/agency/marketplaces/:allowed
// @access   Private
exports.getMarketplaces = asyncHandler(async (req, res, next) => {
  let { allowed } = req.query;

  //fetch all marketplaces
  const data = await Marketplace.findAll({});

  res.status(200).json({
    success: true,
    data,
  });
});
