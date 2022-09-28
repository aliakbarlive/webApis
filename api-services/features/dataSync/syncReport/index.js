const syncReportRoute = require('./syncReport.route');
const syncReportService = require('./syncReport.service');
const syncReportValidation = require('./syncReport.validation');
const syncReportController = require('./syncReport.controller');
const SyncReportRepository = require('./syncReport.repository');

module.exports = {
  syncReportRoute,
  syncReportService,
  syncReportValidation,
  syncReportController,
  SyncReportRepository,
};
