const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth');

const { paginate } = require('../../middleware/advancedList');

const {
  getChurnData,
  exportChurnData,
} = require('../../controllers/agency/reports.churn');
const {
  getMontlySalesByClient,
  exportMontlySalesByClient,
  getMontlySalesBreakdownByClient,
  exportMontlySalesBreakdownByClient,
  getClientsSummary,
  exportClientsSummary,
} = require('../../controllers/agency/reports');

router.get('/churn/:range', protect, getChurnData);
router.get('/churn/:range/export', protect, exportChurnData);
//router.get('/subscriptions/churned', protect, getC)
//router.get('/subscriptions/active', protect, )

router.get('/clients-monthly-sales', protect, paginate, getMontlySalesByClient);
router.get('/clients-monthly-sales/export', protect, exportMontlySalesByClient);
router.get(
  '/clients-monthly-sales-breakdown',
  protect,
  paginate,
  getMontlySalesBreakdownByClient
);
router.get(
  '/clients-monthly-sales-breakdown/export',
  protect,
  exportMontlySalesBreakdownByClient
);
router.get('/clients-summary', protect, paginate, getClientsSummary);
router.get('/clients-summary/export', protect, paginate, exportClientsSummary);

module.exports = router;
