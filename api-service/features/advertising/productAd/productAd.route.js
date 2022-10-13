const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const { account, marketplace, advProfile } = require('@middleware/access');

const {
  paginate,
  withSort,
  withDateRange,
} = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const productAdValidation = require('./productAd.validation');
const productAdController = require('./productAd.controller');

router.get(
  '/products',
  validate(productAdValidation.listProductsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  withDateRange,
  productAdController.listProducts
);

module.exports = router;
