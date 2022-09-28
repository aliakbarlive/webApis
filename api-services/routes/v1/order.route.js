const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth.js');
const { account, marketplace } = require('@middleware/access');
const {
  paginate,
  withFilters,
  withDateRange,
  withSort,
} = require('@middleware/advancedList');

const validate = require('@middleware/validate');

// Request validations.
const {
  getOrderRequest,
  getOrderListRequest,
  getOrdersSummaryRequest,
  getOrdersCountPerStateRequest,
} = require('../../validations/order.validation');

// Controllers
const {
  getOrderList,
  getOrder,
  getOrdersSummary,
  getOrdersCountPerState,
} = require('../../controllers/client/order');

router.get(
  '/summary',
  validate(getOrdersSummaryRequest),
  authenticate('orders.view'),
  account,
  marketplace,
  withFilters,
  withDateRange,
  getOrdersSummary
);

router.get(
  '/states',
  validate(getOrdersCountPerStateRequest),
  authenticate('orders.view'),
  account,
  marketplace,
  withFilters,
  withDateRange,
  getOrdersCountPerState
);

router.get(
  '/',
  validate(getOrderListRequest),
  authenticate('orders.view'),
  account,
  marketplace,
  paginate,
  withFilters,
  withDateRange,
  withSort,
  getOrderList
);

router.get(
  '/:orderId',
  validate(getOrderRequest),
  authenticate('orders.view'),
  account,
  marketplace,
  getOrder
);

module.exports = router;
