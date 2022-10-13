'use strict';

const Queue = require('bull');
const dotenv = require('dotenv');

const { AdvProfile } = require('../../../models');

dotenv.config({ path: 'config/config.env' });
const syncProfileTargetingQueue = require('./syncProfileTargeting');

let queue = new Queue('Targeting Sync', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 1200000,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(async (job) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { rows, count } = await AdvProfile.findAndCountAll();

        for (const row of rows) {
          await syncProfileTargetingQueue.add({
            advProfileId: row.advProfileId,
          });
        }

        return resolve({ count });
      } catch (error) {
        return reject(error);
      }
    });
  });

  queue.on('completed', async function (job, result) {});

  queue.on('failed', async function (job, result) {});

  queue.on('active', async function (job, err) {});

  queue.on('error', function (err) {
    console.log(err);
  });
}

module.exports = queue;
