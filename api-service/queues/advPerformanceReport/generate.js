'use strict';
const Queue = require('bull');

const moment = require('moment');
const dotenv = require('dotenv');

dotenv.config({ path: 'config/config.env' });

const { syncReportService } = require('../../features/dataSync/syncReport');
const { AdvProfile, AdvReportEntity } = require('../../models');

const sleep = require('../../utils/sleep');

const saveReportData = require('./save');

let queue = Queue('Adv. Performance - Generate Report', {
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
  queue.process(15, async (job) => {
    return new Promise(async (resolve, reject) => {
      const { syncReportId } = job.data;

      try {
        await sleep(1000);
        const response = await syncReportService.getSyncReportById(
          syncReportId
        );
        const syncReport = response.data;

        const { advReportEntityId, advProfileId } = syncReport.meta;

        const advProfile = await AdvProfile.findByPk(advProfileId);
        const advReportEntity = await AdvReportEntity.findByPk(
          advReportEntityId
        );

        const advApiClient = await advProfile.apiClient({
          maxWaitTime: 10000,
        });

        const payload = await advReportEntity.getPayload(
          'performance',
          moment(syncReport.date).format('YYYYMMDD')
        );

        // Request report on API Client.
        const report = await advApiClient.requestReport(
          advReportEntity.endpoint,
          advReportEntity.recordType,
          payload
        );

        await syncReport.update({
          referenceId: report.reportId,
        });

        return resolve({
          syncReportId: syncReport.syncReportId,
          delay: advReportEntity.getDelay('performance'),
        });
      } catch (error) {
        return reject(error);
      }
    });
  });

  // Queue completed event hooks
  queue.on('completed', async function (job, result) {
    try {
      const { delay, syncReportId } = result;

      const options = {
        delay: 1000 * 60 * delay,
        attempts: 3,
      };

      const saveJob = await saveReportData.add({ syncReportId }, options);

      await syncReportService.markSyncReportAsRequestedById(syncReportId, {
        jobId: saveJob.id,
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
