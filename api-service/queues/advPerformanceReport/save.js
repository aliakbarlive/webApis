'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const { syncReportService } = require('../../features/dataSync/syncReport');

const saveProcess = require('./saveProcess');

let queue = new Queue('Adv. Performance - Save Records', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 1200000,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(25, saveProcess);

  queue.on('completed', async function (job, result) {
    try {
      await syncReportService.markSyncReportAsProcessedById(
        job.data.syncReportId,
        {
          onQueue: false,
          message: 'Successfully saved records.',
        }
      );
    } catch (error) {
      console.log('Error on completed event', error);
    }
  });

  queue.on('failed', async function (job, result) {
    try {
      const allowedAttempts = job.opts.attempts || 1;

      await syncReportService.markSyncReportAsFailedById(
        job.data.syncReportId,
        {
          message: result.message,
          attempts: job.attemptsMade,
          onQueue: job.attemptsMade < allowedAttempts,
        }
      );
    } catch (error) {
      console.log('Error on failed event', error);
    }
  });

  queue.on('error', function (err) {
    console.log('error');
    console.log(err);
  });

  // Queue active event hooks
  queue.on('active', async function (job, err) {
    try {
      await syncReportService.markSyncReportAsProcessingById(
        job.data.syncReportId,
        {
          message: 'Starting to fetch report data.',
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = queue;
