const targetingRoute = require('./targeting.route');
const targetingService = require('./targeting.service');
const targetingController = require('./targeting.controller');
const targetingValidation = require('./targeting.validation');
const TargetingRepository = require('./targeting.repository');

module.exports = {
  targetingRoute,
  targetingController,
  targetingValidation,
  targetingService,
  TargetingRepository,
};
