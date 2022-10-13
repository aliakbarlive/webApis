const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const validate = require('@middleware/validate');
const { account, marketplace, advProfile } = require('@middleware/access');
const { paginate, withSort } = require('@middleware/advancedList');

const historyController = require('./history.controller');
const historyValidation = require('./history.validation');

router.get(
  '/',
  validate(historyValidation.listHistoryRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  historyController.listHistory
);

router.get(
  '/grouped',
  validate(historyValidation.getGroupedHistoryRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  historyController.getGroupedHistory
);

module.exports = router;
