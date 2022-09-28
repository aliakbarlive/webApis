'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });
const cronProcess = require('./cronProcess');

let queue = Queue('Invoices - Email Cron', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 15,
  },
});

queue.on('completed', async (job) => {
  console.log('cron email pending invoices - completed');
});

queue.process(1, cronProcess);

queue.on('failed', function (job, result) {
  console.log(result);
});

queue.on('error', function (err) {
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log('cron email pending invoices - active');
});

module.exports = queue;
