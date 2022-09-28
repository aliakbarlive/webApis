'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');
const sendProcess = require('./sendProcess');

dotenv.config({ path: 'config/config.env' });

let queue = Queue('Credit Notes - Email Send', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});

queue.on('completed', async (job) => {
  console.log('credit note email - completed');
});

queue.process(1, sendProcess);

queue.on('failed', function (job, result) {
  console.log(result);
});

queue.on('error', function (err) {
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log('credit note email - active');
});

module.exports = queue;
