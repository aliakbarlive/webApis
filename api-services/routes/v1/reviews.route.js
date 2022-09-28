const express = require('express');
const router = express.Router();

const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth.js');
const { account, marketplace } = require('../../middleware/access');
const {
  paginate,
  withFilters,
  withSort,
  withDateRange,
} = require('../../middleware/advancedList.js');

const {
  reviewWebhook,
  getReviews,
  getReview,
} = require('../../controllers/client/review');

const {
  getReviewRequest,
  getReviewsRequest,
} = require('../../validations/review.validation');

router.post('/receive', reviewWebhook);

router.get(
  '/',
  validate(getReviewsRequest),
  authenticate('reviews.view'),
  account,
  marketplace,
  paginate,
  withFilters,
  withSort,
  withDateRange,
  getReviews
);

router.get(
  '/:reviewId',
  validate(getReviewRequest),
  authenticate('reviews.view'),
  account,
  marketplace,
  getReview
);

module.exports = router;
