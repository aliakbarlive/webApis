const Queue = require('bull');
const { syncReportService } = require('../../features/dataSync/syncReport');

const saveProcess = require('./saveProcess');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Inventory - Save Records', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
  },
});

if (process.env.MODE === 'queue') {
  // Process
  queue.process(saveProcess);

  queue.on('completed', async (job, result) => {
    try {
      await syncReportService.markSyncReportAsProcessedById(
        job.data.syncReportId,
        {
          onQueue: false,
          message: 'Successfully saved records.',
        }
      );
    } catch (e) {
      console.log('Error on completed event', e);
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

  queue.on('active', async function (job, err) {
    try {
      await syncReportService.markSyncReportAsProcessingById(
        job.data.syncReportId,
        {
          message: 'Starting to fetch report data.',
        }
      );
    } catch (error) {
      console.log('Error on active event', error);
    }
  });

  queue.on('error', function (err) {
    console.log('Error on error event', err);
  });
}

module.exports = queue;
