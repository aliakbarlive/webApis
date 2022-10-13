'use strict';
const Queue = require('bull');
const { SpReport } = require('../../models');
const saveProcess = require('./saveProcess');

const queue = new Queue('Reviews - Save Collection', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});

queue.process(saveProcess);

queue.on('completed', async (job, result) => {
  try {
    const spReport = await SpReport.findByPk(job.data.spReportId);
    await spReport.markAsCompleted();
  } catch (e) {
    console.log('Error on completed event', e);
  }
});

queue.on('failed', async function (job, result) {
  try {
    const spReport = await SpReport.findByPk(job.data.spReportId);
    const allowedAttempts = job.opts.attempts || 1;

    await spReport.markAsFailed(
      result.message,
      job.attemptsMade,
      job.attemptsMade < allowedAttempts
    );
  } catch (error) {
    console.log('Error on failed event', error);
  }
});

queue.on('active', async function (job, err) {
  try {
    const spReport = await SpReport.findByPk(job.data.spReportId);
    await spReport.markAsProcessing('Starting to fetch collections.');
  } catch (error) {
    console.log('Error on active event', error);
  }
});

queue.on('error', function (err) {
  console.log('Error on error event', err);
});

this.getQueue = function () {
  return queue;
};

module.exports = queue;
