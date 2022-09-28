const Queue = require('bull');
const requestProcess = require('./requestProcess');

const queue = new Queue('Request Keyword Search', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});

queue.process(1, requestProcess);

queue.on('completed', async (job) => {
  console.log('completed');
});

queue.on('failed', function (job, result) {
  console.log('failed');
  console.log(result);
});

queue.on('progress', function (job, result) {
  console.log('progress');
});

queue.on('error', function (err) {
  console.log('error');
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log('active');
});

module.exports = queue;
