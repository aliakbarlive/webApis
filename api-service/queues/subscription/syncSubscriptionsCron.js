'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');

dotenv.config({ path: 'config/config.env' });
const { Subscription } = require('../../models');

const syncStatus = require('./syncStatus');

let queue = Queue('Subscriptions - Webhook Cron', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 20,
  },
  limiter: {
    max: 1,
    duration: 1000 * 60 * 120,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(1, async (job) => {
    const { page = 1 } = job.data;

    return new Promise(async (resolve, reject) => {
      try {
        const pageSize = 50;
        const pageOffset = (page - 1) * pageSize;

        const subs = await Subscription.findAll({
          limit: pageSize,
          offset: pageOffset,
          order: [['activatedAt', 'DESC']],
        });

        subs.forEach(async (subscription, index) => {
          await syncStatus.add({ subscription, loaded: false });
        });

        return resolve({
          page,
          pageSize,
          pageOffset,
        });
      } catch (error) {
        return reject(error);
      }
    });
  });

  queue.on('completed', async (job) => {
    const { page, pageSize, pageOffset } = job.returnvalue;

    queue.add({ page: parseInt(page) + 1 });

    console.log(`subscriptions-sync-completed`, page, pageSize, pageOffset);
  });

  queue.on('failed', function (job, result) {
    console.log(result);
  });

  queue.on('error', function (err) {
    console.log(err);
  });

  queue.on('active', function (job, err) {
    console.log(`subscriptions-sync-active`);
  });
}

module.exports = queue;
