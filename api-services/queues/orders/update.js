'use strict';
const Queue = require('bull');
const updateProcess = require('./updateProcess');
const { SpRequest } = require('../../models');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Order - Update Records', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 400000,
  },
});

// Process
queue.process(10, updateProcess);

queue.on('completed', async (job, result) => {
  try {
    const spRequest = await SpRequest.findByPk(job.data.spRequestId);
    await spRequest.markAsCompleted();
  } catch (e) {
    console.log('Error on completed event', e);
  }
});

queue.on('failed', async function (job, result) {
  try {
    const spRequest = await SpRequest.findByPk(job.data.spRequestId);
    const allowedAttempts = job.opts.attempts || 1;

    await spRequest.markAsFailed(
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
    const spRequest = await SpRequest.findByPk(job.data.spRequestId);
    await spRequest.markAsProcessing('Starting to fetch data.');
  } catch (error) {
    console.log('Error on active event', error);
  }
});

queue.on('error', function (err) {
  console.log('Error on error event', err);
});

module.exports = queue;
