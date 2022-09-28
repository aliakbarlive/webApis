'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
const { Account, InitialSyncStatus } = require('../../models');

dotenv.config({ path: 'config/config.env' });

let queue = Queue('Adv. Performance - Init Cron', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(async (job) => {
    return new Promise(async (resolve, reject) => {
      try {
        await job.progress(10);

        const { rows, count } = await Account.findAndCountAll({
          include: {
            model: InitialSyncStatus,
            as: 'initialSyncStatus',
            where: {
              advPerformanceReport: 'COMPLETED',
            },
          },
        });

        for (const account of rows) {
          await job.log(`Adding cron sync for ${account.accountId}.`);

          await account.sync('advPerformanceReport', 'daily');
        }

        return resolve({ count });
      } catch (error) {
        return reject(error);
      }
    });
  });

  queue.on('failed', function (job, result) {
    console.log(result);
  });

  queue.on('error', function (err) {
    console.log(err);
  });
}

module.exports = queue;
