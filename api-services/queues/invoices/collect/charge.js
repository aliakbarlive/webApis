'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
const chargeProcess = require('./chargeProcess');

dotenv.config({ path: 'config/config.env' });

let queue = Queue('Invoices - Collect', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 300,
    removeOnFail: 500,
  },
});

queue.on('completed', async (job) => {
  console.log('invoice collect - completed');
});

queue.process(1, chargeProcess);

queue.on('failed', function (job, result) {
  console.log(result);
});

queue.on('error', function (err) {
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log('invoice collect - active');
});

module.exports = queue;
