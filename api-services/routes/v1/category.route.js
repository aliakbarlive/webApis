const express = require('express');
const router = express.Router();

const validate = require('../../middleware/validate');
const { protect } = require('../../middleware/auth.js');
const { account, marketplace } = require('../../middleware/access');
const {
  paginate,
  withFilters,
  withSort,
} = require('../../middleware/advancedList.js');

const {
  getCategoryRequest,
  getCategoryListRequest,
} = require('../../validations/category.validation.js');

const {
  getCategory,
  getCategoryList,
} = require('../../controllers/client/category.js');

router.get(
  '/',
  validate(getCategoryListRequest),
  protect,
  account,
  marketplace,
  paginate,
  withFilters,
  withSort,
  getCategoryList
);

router.get(
  '/:categoryId',
  validate(getCategoryRequest),
  protect,
  account,
  marketplace,
  getCategory
);

module.exports = router;
