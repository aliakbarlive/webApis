const Queue = require('bull');

const queue = new Queue('Reviews - Initial Request', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});
const requestProcess = require('./requestProcess');

queue.process(requestProcess);

queue.on('completed', async (job) => {
  console.log('Request reviews collection completed.');
});

queue.on('failed', function (job, result) {
  console.log('Request reviews collection failed.');
  console.log(result);
});

queue.on('error', function (err) {
  console.log('Request reviews collection error.');
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log('Request reviews collection active.');
});

module.exports = queue;
