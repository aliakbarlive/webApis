const analyticsValidation = require('./analytics.validation');
const analyticsController = require('./analytics.controller');
const analyticsService = require('./analytics.service');
const analyticsRoute = require('./analytics.route');

module.exports = {
  analyticsRoute,
  analyticsService,
  analyticsController,
  analyticsValidation,
};
