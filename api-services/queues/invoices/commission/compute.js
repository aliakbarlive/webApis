'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
const computeProcess = require('./computeProcess');
const notifyQueue = require('./notify');

dotenv.config({ path: 'config/config.env' });

let queue = Queue('Invoices - Commission', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 500,
    removeOnFail: 1000,
  },
});

queue.on('active', function (job, err) {
  console.log(`invoices:commission - active`);
});

queue.on('completed', async (job) => {
  sendErrorsNotification();
  console.log(`invoices:commission - completed`);
});

queue.process(1, computeProcess);

queue.on('failed', async (job, result) => {
  sendErrorsNotification();
  console.log(`invoices:commission - failed`, result);
});

queue.on('error', async (err) => {
  console.log(`invoices:commission - error`, err);
});

const sendErrorsNotification = () => {
  queue.getJobCounts().then((res) => {
    if (res.waiting === 0 && res.active === 0) {
      notifyQueue.add();
    } else {
      console.log('waiting for jobs to finish');
    }
  });
};

module.exports = queue;
