const Queue = require('bull');
const moment = require('moment');
const deepCopy = require('../../utils/deepCopy');
const genOrderReport = require('./generate');
const { SyncRecord, SpReport } = require('../../models');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Order - Initial Request', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 300000,
  },
});

queue.process(10, async (job, done) => {
  const { accountId } = job.data;

  // Bull Options
  const attempts = 10;
  const backoff = 1000 * 60 * 5; // 5 minutes to retry
  const options = { attempts, backoff };

  // Set initial and end date for the reports
  // Set to 18 months since that is the limitation for financial events
  const start = moment()
    .subtract(process.env.INITIAL_SYNC_MONTHS, 'months')
    .startOf('day');
  const end = moment();

  const days = end.diff(start, 'days');
  const dayRange = 30;
  let iteration = 1;
  if (days > dayRange) {
    iteration = Math.ceil(days / dayRange);
  }
  let startDate = start;

  let totalDays = days;
  let daysToAdd = 0;

  try {
    // Create initial syncRecord
    const { syncRecordId } = await SyncRecord.create({
      accountId,
      pendingReports: iteration,
      totalReports: iteration,
      syncType: 'initial',
      dataType: 'orders',
      status: 'STARTED',
      syncDate: Date.now(),
    });

    for (let i = 0; i < iteration; i++) {
      if (totalDays > dayRange) {
        totalDays = totalDays - dayRange;
        daysToAdd = dayRange;
      } else {
        daysToAdd = totalDays;
      }
      const endDate = moment(deepCopy(startDate));

      const spReport = await SpReport.create({
        syncRecordId,
        startDate: startDate.format(),
        endDate: endDate.add(daysToAdd, 'days').format(),
      });

      startDate = moment(deepCopy(endDate));

      const data = { spReportId: spReport.spReportId };
      const genJob = await genOrderReport.add(data, options);
      await spReport.update({ jobId: genJob.id });
    }

    done(null, {});
  } catch (error) {
    done(new Error('Error Requesting Report, Retrying!'));
    console.log(error);
  }
});

queue.on('completed', async (job) => {
  console.log(moment().format() + ' - Request Order Report Completed');
});

// Queue waiting event hooks
queue.on('waiting', async function (jobId) {
  console.log(moment().format() + ' - Request Order Report Waiting - ' + jobId);
});

queue.on('failed', function (job, result) {
  console.log(moment().format() + ' - Request Order Report Failed');
  //console.log(result);
});

queue.on('progress', function (job, result) {
  console.log('progress');
});

queue.on('error', function (err) {
  console.log('error');
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log(moment().format() + ' - Request Order Report Active');
});

module.exports = queue;
