const NegativeTargetRepository = require('./negativeTarget.repository');
const negativeTargetController = require('./negativeTarget.controller');
const negativeTargetService = require('./negativeTarget.service');
const negativeTargetRoute = require('./negativeTarget.route');

module.exports = {
  negativeTargetRoute,
  negativeTargetService,
  negativeTargetController,
  NegativeTargetRepository,
};
