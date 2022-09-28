const targetRoute = require('./target.route');
const targetService = require('./target.service');
const targetController = require('./target.controller');

const TargetRepository = require('./target.repository');
const TargetRecordRepository = require('./targetRecord.repository');

module.exports = {
  targetRoute,
  targetService,
  targetController,
  TargetRepository,
  TargetRecordRepository,
};
