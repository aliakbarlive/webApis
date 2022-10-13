const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

const {
  getRatingsByAccountId,
  getRatingByAccountIdAndAsin,
} = require('../../services/rating.service');

// @desc     Get ratings list by accountId.
// @route    GET /api/v1/ratings
// @access   Private
exports.getRatingList = asyncHandler(async (req, res) => {
  const { accountId } = req.account;
  const { pageSize, page } = req.query;

  const { count, rows } = await getRatingsByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: { count, rows, pageSize, page },
  });
});

// @desc     Get Rating details by asin.
// @route    GET /api/v1/ratings
// @access   Private
exports.getRating = asyncHandler(async (req, res) => {
  const { accountId } = req.account;
  const { asin } = req.params;

  const rating = await getRatingByAccountIdAndAsin(accountId, asin, req.query);

  if (!rating) {
    throw new ErrorResponse('Rating not found', 404);
  }

  res.status(200).json({
    success: true,
    data: rating,
  });
});
