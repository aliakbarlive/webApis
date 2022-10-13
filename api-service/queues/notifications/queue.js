const Queue = require('bull');
const initialSyncCompletedProcess = require('./initialSyncCompletedProcess');
const initialSyncStartedProcess = require('./initialSyncStartedProcess');

const queue = new Queue('Email Notifications', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});

queue.process('initialSyncCompleted', initialSyncCompletedProcess);
queue.process('initialSyncStarted', initialSyncStartedProcess);

queue.on('completed', async (job) => {
  console.log(`Notifications Queue: ${job.name} Completed`);
});

queue.on('failed', function (job, result) {
  console.log(`Notifications Queue: ${job.name} Failed`, result.message);
});

queue.on('active', async (job) => {
  console.log(`Notifications Queue: ${job.name} Active`);
});

queue.on('error', function (err) {
  console.log('Notifications Queue: Error', err.message);
});
module.exports = queue;
