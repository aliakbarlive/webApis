const express = require('express');
const router = express.Router();

const validate = require('../../middleware/validate');
const { protect } = require('../../middleware/auth.js');
const { account, marketplace } = require('../../middleware/access');
const {
  paginate,
  withFilters,
  withSort,
} = require('../../middleware/advancedList');

const {
  getRating,
  getRatingList,
} = require('../../controllers/client/rating.js');

const {
  getRatingRequest,
  getRatingListRequest,
} = require('../../validations/rating.validation.js');

router.get(
  '/',
  validate(getRatingListRequest),
  protect,
  account,
  marketplace,
  paginate,
  withFilters,
  withSort,
  getRatingList
);

router.get(
  '/:asin',
  validate(getRatingRequest),
  protect,
  account,
  marketplace,
  getRating
);

module.exports = router;
