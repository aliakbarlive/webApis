const notificationRoute = require('./notification.route');
const notificationService = require('./notification.service');
const notificationValidation = require('./notification.validation');
const notificationController = require('./notification.controller');
const notificationRepository = require('./notification.repository');

module.exports = {
  notificationRoute,
  notificationService,
  notificationValidation,
  notificationController,
  notificationRepository,
};
