const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');

const { paginate, withSort } = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const roleValidation = require('./role.validation');
const roleController = require('./role.controller');

router.get(
  '/',
  authenticate('roles.manage'),
  paginate,
  withSort,
  roleController.listRoles
);

router.post(
  '/',
  validate(roleValidation.roleRequest),
  authenticate('roles.manage'),
  roleController.createRole
);

router.put(
  '/:roleId',
  validate(roleValidation.roleRequest),
  authenticate('roles.manage'),
  roleController.updateRole
);

module.exports = router;
