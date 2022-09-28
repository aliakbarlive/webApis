const express = require('express');
const router = express.Router();

const { authenticate, protect } = require('@middleware/auth');

const { paginate, withSort } = require('@middleware/advancedList');

const validate = require('@middleware/validate');

//const roleValidation = require('./role.validation');
const notificationController = require('./notification.controller');
const {
  entityTypeRequest,
  addNotificationRequest,
} = require('./notification.validation');

//authenticate('roles.manage'),
router.get(
  '/entitytype',
  paginate,
  withSort,
  notificationController.listNotificationEntityTypes
);

router.post(
  '/entitytype',
  validate(entityTypeRequest),
  notificationController.addNotificationEntityType
);

router.get(
  '/',
  paginate,
  withSort,
  protect,
  notificationController.listNotifications
);

router.post(
  '/',
  validate(addNotificationRequest),
  protect,
  notificationController.addNotification
);

router.post('/read', protect, notificationController.markAsReadNotifications);

module.exports = router;
