const Queue = require('bull');
const moment = require('moment');
const deepCopy = require('../../utils/deepCopy');
const { SyncRecord, SpRequest } = require('../../models');
const financialEventQueue = require('./save');
const { Op } = require('sequelize');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Financial Event - Cron Request', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});

queue.process(200, async (job, done) => {
  try {
    const { accountId } = job.data;

    const syncRecord = await SyncRecord.findOne({
      attributes: ['syncDate'],
      where: {
        dataType: 'financialEvents',
        syncType: {
          [Op.or]: ['initial', 'hourly'],
        },
        status: 'COMPLETED',
        accountId,
      },
      order: [['syncDate', 'DESC']],
    });

    const { syncDate } = syncRecord;

    // Bull Options
    const attempts = 10;
    const backoff = 1000 * 60 * 2;
    const options = { attempts, backoff };

    // Set cron start and end date for the reports
    const start = moment(syncDate).startOf('day');
    const end = moment();

    const days = end.diff(start, 'days');
    const batchDays = 30;

    let startDate = start;
    let totalDays = days;
    let daysToAdd = 0;

    let iteration = 1;
    if (days > batchDays) {
      iteration = Math.ceil(days / batchDays);
    }

    // Create cron syncRecord record
    const { syncRecordId } = await SyncRecord.create({
      accountId,
      pendingReports: iteration,
      totalReports: iteration,
      syncType: 'hourly',
      dataType: 'financialEvents',
      status: 'REQUESTING',
      syncDate: end.toISOString(),
    });

    for (let i = 0; i < iteration; i++) {
      if (totalDays > batchDays) {
        totalDays = totalDays - batchDays;
        daysToAdd = batchDays;
      } else {
        daysToAdd = totalDays;
      }

      const endDate = moment(deepCopy(startDate));
      const newEndDate =
        i + 1 !== iteration
          ? endDate.add(daysToAdd, 'days').endOf('day')
          : moment().subtract(2, 'minutes'); // subtract the last end date to 2 minutes

      // Create spRequest record
      const spRequest = await SpRequest.create({
        syncRecordId,
        status: 'PENDING',
        startDate,
        endDate: newEndDate,
      });

      const delay = 2000 * i;
      const saveJob = await financialEventQueue.add(
        { spRequestId: spRequest.spRequestId },
        { ...options, delay }
      );

      await spRequest.update({
        jobId: saveJob.id,
        message: 'Fetching records pending on queue.',
      });

      startDate = moment(deepCopy(newEndDate));
    }
    done(null, {});
  } catch (error) {
    done(new Error(error));
  }
});

queue.on('completed', async (job) => {
  console.log(moment().format() + ' - Cron Financial Event Completed');
});

queue.on('failed', function (job, result) {
  console.log(moment().format() + ' - Cron Financial Event Failed');
  console.log(result);
});

queue.on('error', function (err) {
  console.log('Error on Cron Financial Events');
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log(moment().format() + ' - Cron Financial Event Active');
});

module.exports = queue;
