const syncRecordRoute = require('./syncRecord.route');
const syncRecordService = require('./syncRecord.service');
const syncRecordValidation = require('./syncRecord.validation');
const syncRecordController = require('./syncRecord.controller');
const SyncRecordRepository = require('./syncRecord.repository');

module.exports = {
  syncRecordRoute,
  syncRecordService,
  syncRecordValidation,
  syncRecordController,
  SyncRecordRepository,
};
