const Queue = require('bull');
const moment = require('moment');
const deepCopy = require('../../utils/deepCopy');
const { SyncRecord, SpRequest } = require('../../models');
const financialEventQueue = require('./save');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Financial Event - Initial Request', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 600000,
  },
});

queue.process(25, async (job, done) => {
  try {
    const { accountId } = job.data;

    // Bull Options
    const attempts = 10;
    const backoff = 1000 * 60 * 2;
    const options = { attempts, backoff };

    // Set initial and end date for the reports
    // Limit on how long we go back on getting financial events
    const start = moment()
      .subtract(process.env.INITIAL_SYNC_MONTHS, 'months')
      .startOf('day');
    const end = moment();

    const days = end.diff(start, 'days');
    const batchDays = 1; // length per batch

    let iteration = 1;
    if (days > batchDays) {
      iteration = Math.ceil(days / batchDays);
    }

    let startDate = start;
    let totalDays = days;
    let daysToAdd = 0;

    // Create initial syncRecord record
    const { syncRecordId } = await SyncRecord.create({
      accountId,
      pendingReports: iteration,
      totalReports: iteration,
      syncType: 'initial',
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

      const delay = 10000 * i; // 10 seconds interval

      const saveJob = await financialEventQueue.add(
        { spRequestId: spRequest.spRequestId },
        {
          ...options,
          delay,
        }
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
  console.log(moment().format() + ' - Request Financial Event Completed');
});

queue.on('failed', function (job, result) {
  console.log(moment().format() + ' - Request Financial Event Failed');
  console.log(result);
});

queue.on('error', function (err) {
  console.log('Error on Request Financial Events');
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log(moment().format() + ' - Request Financial Event Active');
});

module.exports = queue;
