const express = require('express');
const path = require('path');
const router = express.Router();
const {
  getMetrics,
  getSnapshot,
  getProducts,
  getNetRevenue,
  getCost,
  getNetProfit,
  getRoi,
  getMargin,
  getProductFees,
  getNetRevenueHistory,
  getNetProfitHistory,
  getCostHistory,
  getRoiHistory,
  getMarginHistory,
  getProfitGraphHistory,
} = require(path.resolve('.', 'controllers/client/profit'));

const { authenticate } = require('@middleware/auth');
const { account, marketplace } = require(path.resolve(
  '.',
  'middleware/access'
));
const { validateDates, validateView } = require(path.resolve(
  '.',
  'middleware/date'
));

router.get(
  '/metrics',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  getMetrics
);

router.get(
  '/snapshot',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  getSnapshot
);

router.get(
  '/products',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  getProducts
);

router.get(
  '/breakdown/net-revenue',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  getNetRevenue
);

router.get(
  '/breakdown/cost',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  getCost
);

router.get(
  '/breakdown/net-profit',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  getNetProfit
);

router.get(
  '/breakdown/roi',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  getRoi
);

router.get(
  '/breakdown/margin',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  getMargin
);

router.get(
  '/breakdown/product/fees',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  getProductFees
);

router.get(
  '/history/net-revenue',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  validateView,
  getNetRevenueHistory
);

router.get(
  '/history/net-profit',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  validateView,
  getNetProfitHistory
);

router.get(
  '/history/cost',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  validateView,
  getCostHistory
);

router.get(
  '/history/roi',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  validateView,
  getRoiHistory
);

router.get(
  '/history/margin',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  validateView,
  getMarginHistory
);

router.get(
  '/history/profit-graph',
  authenticate('profits.view'),
  account,
  marketplace,
  validateDates,
  validateView,
  getProfitGraphHistory
);

module.exports = router;
