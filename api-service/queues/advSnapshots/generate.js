'use strict';
const Queue = require('bull');

const dotenv = require('dotenv');

dotenv.config({ path: 'config/config.env' });

const { syncReportService } = require('../../features/dataSync/syncReport');
const { AdvProfile } = require('../../models');

const saveSnapshotQueue = require('./save');

let queue = Queue('Adv. Snapshots - Generate Report', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 150000,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(5, async (job) => {
    return new Promise(async (resolve, reject) => {
      const { syncReportId } = job.data;

      try {
        const response = await syncReportService.getSyncReportById(
          syncReportId
        );

        const syncReport = response.data;

        const { recordType, advProfileId, endpoint } = syncReport.meta;

        const advProfile = await AdvProfile.findByPk(advProfileId);

        const advApiClient = await advProfile.apiClient();

        // Request snapshot on API Client.
        const snapshot = await advApiClient.requestSnapshot(
          endpoint,
          recordType
        );

        await syncReport.update({
          referenceId: snapshot.snapshotId,
        });

        return resolve({
          syncReportId: syncReport.syncReportId,
          recordType,
        });
      } catch (error) {
        return reject(error);
      }
    });
  });

  // Queue completed event hooks
  queue.on('completed', async function (job, result) {
    try {
      const { syncReportId } = result;

      const options = {
        delay: 1000 * 60 * 10,
        attempts: 3,
      };

      await saveSnapshotQueue.add('default', { syncReportId }, options);

      await syncReportService.markSyncReportAsRequestedById(syncReportId, {
        message: 'Reports requested to 3rd party API.',
      });
    } catch (error) {
      console.log('Error on completed event', error);
    }
  });

  // Queue failed event hooks
  queue.on('failed', async function (job, result) {
    try {
      const allowedAttempts = job.opts.attempts || 1;

      await syncReportService.markSyncReportAsFailedById(
        job.data.syncReportId,
        {
          message: `Failed to generate report. Error ${result.message}`,
          attempts: job.attemptsMade,
          onQueue: job.attemptsMade < allowedAttempts,
        }
      );
    } catch (error) {
      console.log('Error on failed event', error);
    }
  });

  // Queue active event hooks
  queue.on('active', async function (job, err) {
    try {
      await syncReportService.markSyncReportAsRequestingById(
        job.data.syncReportId,
        {
          message: 'Starting to generate report.',
        }
      );
    } catch (error) {
      console.log('Error on active event', error);
    }
  });

  // Queue error event hooks
  queue.on('error', function (err) {
    console.log('error');
    console.log(err);
  });
}

module.exports = queue;
