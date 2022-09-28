const asyncHandler = require('../../middleware/async');

const {
  getReviewsByAccountId,
  getReviewByAccountIdAndReviewId,
  addJobToSaveReviewsQueue,
} = require('../../services/review.service');

// @desc     Get All Product Reviews by account
// @route    GET /api/v1/reviews
// @access   Private
exports.getReviews = asyncHandler(async (req, res) => {
  const { accountId } = req.account;
  const reviews = await getReviewsByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: reviews,
  });
});

// @desc     Get All Product Reviews by account
// @route    GET /api/v1/reviews/:reviewId
// @access   Private
exports.getReview = asyncHandler(async (req, res) => {
  const { accountId } = req.account;
  const { reviewId } = req.params;

  const review = await getReviewByAccountIdAndReviewId(accountId, reviewId, {
    marketplaceId: req.marketplace.marketplaceId,
  });

  if (!review) {
    throw new ErrorResponse('Review not found', 404);
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc     Webhook for RAINFOREST API
// @route    POST /api/v1/reviews/receive
// @access   Public
exports.reviewWebhook = asyncHandler(async (req, res) => {
  await addJobToSaveReviewsQueue(req.body);

  res.status(200).end();
});
