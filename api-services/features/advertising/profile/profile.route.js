const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const { account } = require('@middleware/access');

const { paginate, withSort } = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const profileValidation = require('./profile.validation');
const profileController = require('./profile.controller');

router.get(
  '/',
  validate(profileValidation.listProfilesRequest),
  authenticate('ppc.view'),
  account,
  paginate,
  withSort,
  profileController.listProfiles
);

module.exports = router;
