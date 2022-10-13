const Response = require('@utils/response');

const SyncRecordRepository = require('./syncRecord.repository');
const { paginate } = require('@services/pagination.service');
const advPerformanceInitCronQueue = require('@queues/advPerformanceReport/initCron');
const advSnapshotsInitCronQueue = require('@queues/advSnapshots/initCron');

/**
 * List sync records.
 *
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listSyncRecords = async (options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await SyncRecordRepository.findAndCountAll(options);

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Sync records successfully fetched.');
};

/**
 * Get sync record by syncRecordId.
 *
 * @param {bigint} syncRecordId
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getSyncReportById = async (syncRecordId, options) => {
  const syncRecord = await SyncRecordRepository.findById(syncRecordId, options);

  if (!syncRecord) {
    return new Response().withStatus(404).withMessage('Sync record not found');
  }

  return new Response()
    .withData(syncRecord)
    .withMessage('Sync record successfully fetched.');
};

/**
 * Init sync records cron.
 *
 * @param {string} dataType
 * @returns {Promise<Response>} response
 */
const initSyncRecordsCron = async (dataType) => {
  const queues = {
    advSnapshots: advSnapshotsInitCronQueue,
    advPerformanceReport: advPerformanceInitCronQueue,
  };

  await queues[dataType].add();

  return new Response().withMessage(
    `Initialize cron sync for ${dataType} started.`
  );
};

module.exports = { listSyncRecords, getSyncReportById, initSyncRecordsCron };
