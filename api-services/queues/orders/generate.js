const Queue = require('bull');
const sleep = require('../../utils/sleep');
const saveOrderQueue = require('./save');
const {
  SpReport,
  SyncRecord,
  Marketplace,
  AccountMarketplace,
} = require('../../models');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Order - Generate Report', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 300000,
  },
});

queue.process(10, async (job, done) => {
  const { spReportId } = job.data;

  try {
    await sleep(1000);

    const spReport = await SpReport.findByPk(spReportId, {
      include: {
        model: SyncRecord,
        as: 'syncRecord',
      },
    });

    const account = await spReport.syncRecord.getAccount({
      include: {
        model: AccountMarketplace,
        as: 'marketplaces',
        attributes: ['marketplaceId'],
        include: {
          model: Marketplace,
          attributes: [],
          as: 'details',
        },
      },
    });

    const spApiClient = await account.spApiClient('na');

    const { reportId } = await spApiClient.callAPI({
      operation: 'createReport',
      body: {
        reportType: 'GET_FLAT_FILE_ALL_ORDERS_DATA_BY_ORDER_DATE_GENERAL',
        dataStartTime: spReport.startDate,
        dataEndTime: spReport.endDate,
        marketplaceIds: account.marketplaces.map(
          (marketplace) => marketplace.marketplaceId
        ),
      },
    });

    await spReport.update({ reportId });

    return done(null, {
      spReportId: spReport.spReportId,
    });
  } catch (error) {
    return done(error);
  }
});

// Queue completed event hooks
queue.on('completed', async function (job, result) {
  const { spReportId } = job.data;
  try {
    const spReport = await SpReport.findByPk(spReportId);
    const syncRecord = await spReport.getSyncRecord();

    const options = {
      attempts: 60, // maximum of 5 hours processing
      backoff: 1000 * 60 * 5, // 5 minutes to retr
      delay: 1000 * 60 * 5, // fix delay of 5 minutes to all reports
    };

    const saveOrderJob = await saveOrderQueue.add(result, options);

    await spReport.update({
      status: 'REQUESTED',
      jobId: saveOrderJob.id,
      message: 'Reports requested to 3rd party API.',
    });

    const syncRecordReportsCount = await syncRecord.countSpReports({
      where: {
        status: 'REQUESTED',
      },
    });

    if (syncRecord.totalReports == syncRecordReportsCount) {
      await syncRecord.markAs('REQUESTED');
    }
  } catch (error) {
    console.log('Error on completed event', error);
  }
});

// Queue failed event hooks
queue.on('failed', async function (job, result) {
  try {
    const spReport = await SpReport.findByPk(job.data.spReportId);

    const allowedAttempts = job.opts.attempts || 1;

    await spReport.markAsFailed(
      `Failed to generate report. ${result.message}`,
      job.attemptsMade,
      job.attemptsMade < allowedAttempts
    );
  } catch (error) {
    console.log('Error on failed event', error);
  }
});

// Queue active event hooks
queue.on('active', async function (job, err) {
  try {
    const spReport = await SpReport.findByPk(job.data.spReportId);

    await spReport.update({
      status: 'REQUESTING',
      message: 'Starting to generate report.',
    });

    const syncRecord = await SyncRecord.findByPk(spReport.syncRecordId);
    await syncRecord.markAs('REQUESTING');
  } catch (error) {
    console.log('Error on active event', error);
  }
});

queue.on('error', function (err) {
  console.log('error');
  console.log(err);
});

module.exports = queue;
