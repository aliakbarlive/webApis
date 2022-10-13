const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const validate = require('@middleware/validate');
const { account, marketplace, advProfile } = require('@middleware/access');
const { checkIfAllowedToSubmitChanges } = require('@middleware/advertising');
const { paginate, withFilters, withSort } = require('@middleware/advancedList');

const { withDateRange } = require('@middleware/advancedList');

const optimizationController = require('./optimization.controller');
const optimizationReportController = require('./optimizationReport.controller');
const optimizationReportItemController = require('./optimizationReportItem.controller');
const optimizationReportItemOptionController = require('./optimizationReportItemOption.controller');

const optimizationValidation = require('./optimization.validation');
const optimizationReportValidation = require('./optimizationReport.validation');

router.get(
  '/',
  validate(optimizationValidation.listOptimizations),
  authenticate(
    'ppc.optimization.noApproval',
    'ppc.optimization.requireApproval'
  ),
  account,
  marketplace,
  advProfile,
  paginate,
  withFilters,
  withSort,
  optimizationController.listOptimizations
);

router.post(
  '/reports',
  validate(optimizationReportValidation.createOptimizationReport),
  authenticate(
    'ppc.optimization.noApproval',
    'ppc.optimization.requireApproval'
  ),
  account,
  marketplace,
  advProfile,
  withDateRange,
  optimizationReportController.createOptimizationReport
);

router.get(
  '/reports/:reportId',
  validate(optimizationReportValidation.getOptimizationReport),
  authenticate(
    'ppc.optimization.noApproval',
    'ppc.optimization.requireApproval'
  ),
  account,
  marketplace,
  advProfile,
  optimizationReportController.getOptimizationReport
);

router.post(
  '/reports/:reportId/process',
  validate(optimizationReportValidation.processOptimizationReport),
  authenticate(
    'ppc.optimization.noApproval',
    'ppc.optimization.requireApproval'
  ),
  account,
  marketplace,
  advProfile,
  checkIfAllowedToSubmitChanges,
  optimizationReportController.processOptimizationReport
);

router.get(
  '/reports/:reportId/items',
  validate(optimizationReportValidation.getOptimizationReportItems),
  authenticate(
    'ppc.optimization.noApproval',
    'ppc.optimization.requireApproval'
  ),
  account,
  marketplace,
  advProfile,
  paginate,
  withFilters,
  withSort,
  optimizationReportItemController.listReportItems
);

router.put(
  '/reports/:reportId/items/:itemId/options/:optionId',
  validate(optimizationReportValidation.updateOptimizationReportItemOption),
  authenticate(
    'ppc.optimization.noApproval',
    'ppc.optimization.requireApproval'
  ),
  account,
  marketplace,
  advProfile,
  optimizationReportItemOptionController.updateReportItemOption
);

module.exports = router;
