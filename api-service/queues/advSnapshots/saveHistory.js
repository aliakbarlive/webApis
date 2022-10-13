'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');

dotenv.config({ path: 'config/config.env' });
const saveHistoryAutoProcess = require('./saveHistoryAutoProcess');
const saveHistoryManualProcess = require('./saveHistoryManualProcess');

let queue = new Queue('Adv. Snapshots - Save History', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 600000,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
  },
});

if (process.env.MODE === 'queue') {
  queue.process('auto', 50, saveHistoryAutoProcess);
  queue.process('manual', 50, saveHistoryManualProcess);

  queue.on('failed', async function (job, result) {
    console.log(result.message);
  });

  queue.on('error', function (err) {
    console.log('error');
    console.log(err);
  });
}

module.exports = queue;
