'use strict';
const Queue = require('bull');
const moment = require('moment');
const saveFinancialEvent = require('./process');
const { SyncRecord, SpRequest } = require('../../models');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

let queue = new Queue('Financial Event - Save', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 300000,
  },
});

queue.process(10, saveFinancialEvent);

queue.on('completed', async (job, result) => {
  try {
    const spRequest = await SpRequest.findByPk(job.data.spRequestId);

    await spRequest.markAsCompleted();
  } catch (error) {
    console.log(error);
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

queue.on('error', function (err) {
  console.log(moment().format() + ' - Financial Event Queue Error');
  console.log(err);
});

queue.on('active', async function (job, err) {
  try {
    const spRequest = await SpRequest.findByPk(job.data.spRequestId);

    await spRequest.markAsProcessing('Starting to fetch records.');
  } catch (error) {
    console.log('Error on active event', error);
  }
});

module.exports = queue;
