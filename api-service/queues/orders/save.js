'use strict';
const Queue = require('bull');
const saveOrderProcess = require('./saveProcess');
const { SpReport } = require('../../models');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Order - Save Records', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 300000,
  },
});

// Process
queue.process(10, saveOrderProcess);

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
    await spReport.markAsProcessing('Starting to fetch report data.');
  } catch (error) {
    console.log('Error on active event', error);
  }
});

queue.on('error', function (err) {
  console.log('Error on error event', err);
});

module.exports = queue;
