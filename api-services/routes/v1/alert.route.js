const express = require('express');
const router = express.Router();

// Middlewares
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth.js');
const { account, marketplace } = require('../../middleware/access');

const {
  paginate,
  withFilters,
  withSort,
  withScope,
  withDateRange,
} = require('../../middleware/advancedList');

// Controllers
const {
  getAlertList,
  getAlertDetails,
  resolveAlert,
  unresolveAlert,
} = require('../../controllers/client/alert');

// Validations
const {
  getAlertListRequest,
  getAlertDetailsRequest,
  resolveAlertRequest,
  unresolveAlertRequest,
} = require('../../validations/alert.validation');

router.get(
  '/',
  validate(getAlertListRequest),
  authenticate('alerts.view'),
  account,
  marketplace,
  paginate,
  withFilters,
  withSort,
  withScope,
  withDateRange,
  getAlertList
);

router.get(
  '/:alertId',
  validate(getAlertDetailsRequest),
  authenticate('alerts.view'),
  account,
  marketplace,
  getAlertDetails
);

router.post(
  '/:alertId/resolve',
  validate(resolveAlertRequest),
  authenticate('alerts.view'),
  account,
  marketplace,
  resolveAlert
);

router.post(
  '/:alertId/unresolve',
  validate(unresolveAlertRequest),
  authenticate('alerts.view'),
  account,
  marketplace,
  unresolveAlert
);

module.exports = router;
