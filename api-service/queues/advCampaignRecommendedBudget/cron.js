'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
const { AdvProfile } = require('../../models');

dotenv.config({ path: 'config/config.env' });

const save = require('./save');

let queue = Queue('Adv. Campaign Recommended Budget - Cron', {
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
        const { rows, count } = await AdvProfile.findAndCountAll({
          where: { sandbox: false },
        });

        rows.map(({ advProfileId }) => save.add({ advProfileId }));

        return resolve({ count });
      } catch (error) {
        return reject(error);
      }
    });
  });

  queue.on('completed', async (job) => {
    console.log(`adv-campaign-recommended-budget-cron-completed`);
  });

  queue.on('failed', function (job, result) {
    console.log(result);
  });

  queue.on('error', function (err) {
    console.log(err);
  });

  queue.on('active', function (job, err) {
    console.log(`adv-campaign-recommended-budget-cron-active`);
  });
}

module.exports = queue;
