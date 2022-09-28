const historyRoute = require('./history.route');
const historyService = require('./history.service');
const historyController = require('./history.controller');
const historyValidation = require('./history.validation');
const HistoryRepository = require('./history.repository');

module.exports = {
  historyRoute,
  historyService,
  historyController,
  historyValidation,
  HistoryRepository,
};
