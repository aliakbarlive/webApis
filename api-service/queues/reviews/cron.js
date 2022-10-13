const Queue = require('bull');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Reviews - Cron Request', {
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
