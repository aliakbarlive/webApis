const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const validate = require('@middleware/validate');
const { paginate, withFilters, withSort } = require('@middleware/advancedList');

const changeRequestController = require('./changeRequest.controller');
const changeRequestValidation = require('./changeRequest.validation');

router.get(
  '/',
  validate(changeRequestValidation.listChangeRequests),
  authenticate('ppc.changeRequest.list'),
  paginate,
  withFilters,
  withSort,
  changeRequestController.listChangeRequests
);

router.get(
  '/:changeRequestId',
  validate(changeRequestValidation.getChangeRequest),
  authenticate('ppc.changeRequest.list', 'ppc.changeRequest.evaluate'),
  changeRequestController.getChangeRequest
);

router.post(
  '/:changeRequestId/approve',
  validate(changeRequestValidation.approveChangeRequest),
  authenticate('ppc.changeRequest.evaluate'),
  changeRequestController.approveChangeRequest
);

router.post(
  '/:changeRequestId/reject',
  validate(changeRequestValidation.rejectChangeRequest),
  authenticate('ppc.changeRequest.evaluate'),
  changeRequestController.rejectChangeRequest
);

module.exports = router;
