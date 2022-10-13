'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
const notifyProcess = require('./notifyProcess');

dotenv.config({ path: 'config/config.env' });

let queue = Queue('Invoices - Commission Error Notify', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 15,
  },
});

queue.on('active', function (job, err) {
  console.log(`invoices:commissionerror:notify - active`);
});

queue.on('completed', async (job) => {
  console.log(`invoices:commissionerror:notify - completed`);
});

queue.process(1, notifyProcess);

queue.on('failed', async (job, result) => {
  console.log(`invoices:commissionerror:notify - failed`, result);
});

queue.on('error', async (err) => {
  console.log(`invoices:commissionerror:notify - error`, err);
});

module.exports = queue;
