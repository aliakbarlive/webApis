const express = require('express');
const {
  addCommission,
  getCommission,
  updateCommission,
  deleteCommission,
  computeCommission,
  getOrderMetrics,
  getBenchmarkAverage,
  getBenchmarkAverageAsin,
  getRollingAverage,
  getYearlySalesDifference,
  getBenchmarkAverageAll,
  getOrderMetricsCustom,
} = require('../../controllers/agency/commissions');

const { protect, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const {
  commissionRequest,
  updateCommissionRequest,
} = require('../../validations/commission.validation');
const router = express.Router();

router.post('/', validate(commissionRequest), protect, addCommission);
router.get('/:commissionId', protect, getCommission);
router.put(
  '/:commissionId',
  validate(updateCommissionRequest),
  protect,
  updateCommission
);
router.delete('/:commissionId', protect, deleteCommission);
router.post('/:commissionId/metrics', protect, getOrderMetrics);
router.post('/:commissionId/compute/benchmark', protect, getBenchmarkAverage);
router.post(
  '/:commissionId/compute/benchmark/asin',
  protect,
  getBenchmarkAverageAsin
);
router.post(
  '/:commissionId/compute/benchmark/all',
  protect,
  getBenchmarkAverageAll
);
router.post('/:commissionId/compute/rolling', protect, getRollingAverage);
router.post(
  '/:commissionId/yearly-sales-difference',
  protect,
  getYearlySalesDifference
);

router.post('/compute', protect, computeCommission);
router.post('/metrics', protect, getOrderMetricsCustom);

module.exports = router;
