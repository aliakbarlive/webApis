const Queue = require('bull');

const requestProcess = require('./requestProcess');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Shipment Items - Initial Request', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});

queue.process(5, requestProcess);

queue.on('completed', async (job) => {
  console.log('Request inbound FBA shipment items completed');
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
  console.log('Request inbound FBA shipment items active');
});

module.exports = queue;
