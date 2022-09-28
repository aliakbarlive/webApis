const moment = require('moment');

const SyncReportRepository = require('./syncReport.repository');
const { paginate } = require('@services/pagination.service');
const Response = require('@utils/response');
const { upperFirst } = require('lodash');

/**
 * List sync reports.
 *
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listSyncReports = async (options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await SyncReportRepository.findAndCountAll(options);

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Sync reports successfully fetched.');
};

/**
 * Get sync report.
 *
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const getSyncReportById = async (syncReportId, options) => {
  const syncReport = await SyncReportRepository.findById(syncReportId, options);

  return new Response()
    .withData(syncReport)
    .withMessage('Sync report successfully fetched.');
};

/**
 * Mark sync report as processing.
 *
 * @param {bigint} syncReportId
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const markSyncReportAsProcessingById = async (syncReportId, options = {}) => {
  const PROCESSING = 'PROCESSING';
  const syncReport = await SyncReportRepository.findById(syncReportId, {
    include: ['syncRecord'],
  });

  await SyncReportRepository.updateBySyncReportId(syncReportId, {
    status: PROCESSING,
    startedAt: new Date(),
    ...options,
  });

  const count = await SyncReportRepository.countBySyncRecordId(
    syncReport.syncRecordId,
    { status: 'NOT-STARTED' }
  );

  if (syncReport.syncRecord.totalReports == count) {
    await syncReport.syncRecord.markAs(PROCESSING);
  }

  return new Response().withMessage(
    'Sync report successfully mark as processing'
  );
};

/**
 * Mark sync report as processed.
 *
 * @param {bigint} syncReportId
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const markSyncReportAsProcessedById = async (syncReportId, options = {}) => {
  const PROCESSED = 'PROCESSED';
  const syncReport = await SyncReportRepository.findById(syncReportId, {
    include: ['syncRecord'],
  });

  await SyncReportRepository.updateBySyncReportId(syncReportId, {
    status: PROCESSED,
    completedAt: new Date(),
    processingTime: moment().diff(moment(syncReport.startedAt), 'seconds'),
    ...options,
  });

  await syncReport.syncRecord.decrement('pendingReports');

  const count = await SyncReportRepository.countBySyncRecordId(
    syncReport.syncRecordId,
    { status: PROCESSED }
  );

  if (syncReport.syncRecord.totalReports == count) {
    await syncReport.syncRecord.markAs(PROCESSED);
  }

  return new Response().withMessage(
    'Sync report successfully mark as processed'
  );
};

/**
 * Mark sync report as failed.
 *
 * @param {bigint} syncReportId
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const markSyncReportAsFailedById = async (syncReportId, options = {}) => {
  const FAILED = 'FAILED';

  const syncReport = await SyncReportRepository.findById(syncReportId, {
    include: ['syncRecord'],
  });

  await SyncReportRepository.updateBySyncReportId(syncReportId, {
    status: FAILED,
    ...options,
  });

  const count = await SyncReportRepository.countBySyncRecordId(
    syncReport.syncRecordId,
    { status: FAILED, onQueue: false }
  );

  if (syncReport.syncRecord.totalReports == count) {
    await syncReport.syncRecord.markAs(FAILED);
  }

  return new Response().withMessage('Sync report successfully mark as failed');
};

/**
 * Mark sync report as requesting.
 *
 * @param {bigint} syncReportId
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const markSyncReportAsRequestingById = async (syncReportId, options = {}) => {
  const REQUESTING = 'REQUESTING';

  const syncReport = await SyncReportRepository.findById(syncReportId, {
    include: ['syncRecord'],
  });

  await SyncReportRepository.updateBySyncReportId(syncReportId, {
    status: REQUESTING,
    ...options,
  });

  await syncReport.syncRecord.markAs(REQUESTING);

  return new Response().withMessage('Sync report successfully mark as failed');
};

/**
 * Mark sync report as requesting.
 *
 * @param {bigint} syncReportId
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const markSyncReportAsRequestedById = async (syncReportId, options = {}) => {
  const REQUESTED = 'REQUESTED';

  const syncReport = await SyncReportRepository.findById(syncReportId, {
    include: ['syncRecord'],
  });

  await SyncReportRepository.updateBySyncReportId(syncReportId, {
    status: REQUESTED,
    ...options,
  });

  const count = await SyncReportRepository.countBySyncRecordId(
    syncReport.syncRecordId,
    { status: REQUESTED }
  );

  if (syncReport.syncRecord.totalReports == count) {
    await syncReport.syncRecord.markAs(REQUESTED);
  }

  return new Response().withMessage('Sync report successfully mark as failed');
};

const retrySyncReportById = async (syncReportId) => {
  const syncReport = await SyncReportRepository.findById(syncReportId, {
    include: ['syncRecord'],
  });

  if (!syncReport) {
    return new Response()
      .failed()
      .withCode(404)
      .withMessage('Sync report not found.');
  }

  if (syncReport.onQueue || syncReport.status === 'PROCESSED') {
    return new Response()
      .failed()
      .withCode(400)
      .withMessage('Cannot processed retry.');
  }

  if (syncReport.syncRecord.dataType === 'advSnapshots') {
    return await retryAdvSnapshotsReport(syncReport);
  }

  return new Response()
    .failed()
    .withCode(400)
    .withMessage('Sync report retry handler not found.');
};

const retryAdvSnapshotsReport = async (syncReport) => {
  const { syncReportId } = syncReport;

  if (
    syncReport.meta.advanced ||
    syncReport.syncRecord.syncType === 'initial'
  ) {
    const saveSnapshotQueue = require('@queues/advSnapshots/save');
    await saveSnapshotQueue.add(
      'advanced',
      { syncReportId },
      {
        attempts: 3,
        backoff: 6000,
      }
    );

    return new Response().withMessage('Sync report successfully retried');
  }

  const generateSnapshotQueue = require('@queues/advSnapshots/generate');
  await generateSnapshotQueue.add({ syncReportId }, { attempts: 3 });

  await SyncReportRepository.updateBySyncReportId(syncReportId, {
    startedAt: new Date(),
    onQueue: true,
    status: 'STARTED',
  });

  return new Response().withMessage('Sync report successfully retried');
};

module.exports = {
  listSyncReports,
  getSyncReportById,
  markSyncReportAsProcessingById,
  markSyncReportAsProcessedById,
  markSyncReportAsFailedById,
  markSyncReportAsRequestedById,
  markSyncReportAsRequestingById,
  retryAdvSnapshotsReport,
  retrySyncReportById,
};
