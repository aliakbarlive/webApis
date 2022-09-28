const express = require('express');
const router = express.Router();

const validate = require('../../middleware/validate');
const { protect } = require('../../middleware/auth.js');
const { account, marketplace } = require('../../middleware/access');
const {
  paginate,
  withFilters,
  withSort,
  withDateRange,
} = require('../../middleware/advancedList.js');

const {
  getKeywordListRequest,
  getKeywordRequest,
  updateKeywordRequest,
  addKeywordRequest,
  searchKeywordsRequest,
} = require('../../validations/keyword.validation');

const {
  getKeywordList,
  getKeyword,
  updateKeyword,
  addKeyword,
  searchKeywords,
} = require('../../controllers/client/keyword');

router.get(
  '/',
  validate(getKeywordListRequest),
  protect,
  account,
  marketplace,
  paginate,
  withFilters,
  withSort,
  withDateRange,
  getKeywordList
);

router.get(
  '/:keywordId',
  validate(getKeywordRequest),
  protect,
  account,
  marketplace,
  withFilters,
  withDateRange,
  getKeyword
);

router.post(
  '/',
  validate(addKeywordRequest),
  protect,
  account,
  marketplace,
  addKeyword
);

router.put(
  '/:keywordId',
  validate(updateKeywordRequest),
  protect,
  account,
  marketplace,
  updateKeyword
);

router.post(
  '/search',
  validate(searchKeywordsRequest),
  protect,
  account,
  marketplace,
  searchKeywords
);

module.exports = router;
