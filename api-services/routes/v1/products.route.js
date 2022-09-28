const express = require('express');

const router = express.Router();

const validate = require('@middleware/validate.js');
const { authenticate } = require('@middleware/auth.js');
const { account, marketplace } = require('@middleware/access');

const {
  paginate,
  withFilters,
  withSort,
} = require('@middleware/advancedList.js');

const {
  getProduct,
  getProductList,
  getGroupedProductList,
  receiveProductCollection,
} = require('../../controllers/client/product.js');

const {
  getProductListRequest,
  getProductRequest,
  getGroupedProductListRequest,
} = require('../../validations/product.validation');

router.post('/collection/receive', receiveProductCollection);

router.get(
  '/',
  validate(getProductListRequest),
  authenticate('products.view', 'orders.view', 'alerts.view', 'profits.view'),
  account,
  marketplace,
  paginate,
  withFilters,
  withSort,
  getProductList
);

router.get(
  '/grouped',
  validate(getGroupedProductListRequest),
  authenticate('products.view'),
  account,
  marketplace,
  paginate,
  withFilters,
  withSort,
  getGroupedProductList
);

router.get(
  '/:asin',
  validate(getProductRequest),
  authenticate('products.view'),
  account,
  marketplace,
  getProduct
);

module.exports = router;
