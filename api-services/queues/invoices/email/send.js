'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
const sendProcess = require('./sendProcess');

dotenv.config({ path: 'config/config.env' });

let queue = Queue('Invoices - Email Send', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 300,
  },
});

queue.on('completed', async (job) => {
  console.log('invoice email - completed');
});

queue.process(1, sendProcess);

queue.on('failed', function (job, result) {
  console.log(result);
});

queue.on('error', function (err) {
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log('invoice email - active');
});

module.exports = queue;
