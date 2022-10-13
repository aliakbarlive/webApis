const reportRoute = require('./report.route');
const reportService = require('./report.service');
const reportController = require('./report.controller');
const reportValidation = require('./report.validation');
const ReportRepository = require('./report.repository');

module.exports = {
  reportRoute,
  reportService,
  reportController,
  reportValidation,
  ReportRepository,
};
