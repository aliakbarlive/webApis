const Queue = require('bull');
const requestProcess = require('./requestProcess');

const queue = new Queue('Products - Initial Request', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(requestProcess);

  queue.on('completed', async (job) => {
    console.log('Request products collection completed.');
  });

  queue.on('failed', function (job, result) {
    console.log('Request products collection failed.');
    console.log(result);
  });

  queue.on('error', function (err) {
    console.log('Request products collection error.');
    console.log(err);
  });

  queue.on('active', function (job, err) {
    console.log('Request products collection active.');
  });
}

module.exports = queue;
