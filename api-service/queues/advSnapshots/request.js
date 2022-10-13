'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');

const requestProcess = require('./requestProcess');

dotenv.config({ path: 'config/config.env' });

let queue = Queue('Adv. Snapshots - Initial Request', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(5, requestProcess);

  queue.on('failed', function (job, result) {
    console.log(result);
  });

  queue.on('error', function (err) {
    console.log(err);
  });
}

module.exports = queue;
