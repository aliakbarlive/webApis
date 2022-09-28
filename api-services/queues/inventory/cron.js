const Queue = require('bull');
const requestProcess = require('./requestProcess');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Inventory - Cron Request', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(1, requestProcess);

  queue.on('completed', async (job) => {
    console.log('Request inventory completed');
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
    console.log('Request inventory queue active');
  });
}

module.exports = queue;
