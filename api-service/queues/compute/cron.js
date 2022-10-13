'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });
const cronProcess = require('./cronProcess');

let queue = Queue('Compute Commissions Cron', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 500,
  },
});

queue.on('completed', async (job) => {
  console.log(`compute cron completed`);
});

queue.process(1, cronProcess);

queue.on('failed', function (job, result) {
  console.log(result);
});

queue.on('error', function (err) {
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log(`compute cron active`);
});

module.exports = queue;
