const Queue = require('bull');
const moment = require('moment');
const updateOrder = require('./update');
const {
  SyncRecord,
  SpRequest,
  Account,
  Marketplace,
  AccountMarketplace,
} = require('../../models');
const { Op } = require('sequelize');

const dotenv = require('dotenv');
const sleep = require('../../utils/sleep');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('Order - Cron Request', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});

queue.process(200, async (job, done) => {
  const { accountId } = job.data;

  // Bull Options
  const options = {
    attempts: 10,
    backoff: 1000 * 60 * 5, // 5 minutes
  };
  let delay = 0;

  try {
    const syncRecord = await SyncRecord.findOne({
      attributes: ['syncDate'],
      where: {
        dataType: 'orders',
        syncType: {
          [Op.or]: ['initial', 'hourly'],
        },
        status: 'COMPLETED',
        accountId,
      },
      order: [['syncDate', 'DESC']],
    });

    const account = await Account.findByPk(accountId, {
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

    // * Initialize SP-API client
    const spApiClient = await account.spApiClient('na');

    let NextToken;
    let orders = [];

    while (NextToken === undefined || NextToken !== null) {
      try {
        await sleep(1000);
        // * Make SP-API call
        let response = await spApiClient.callAPI({
          endpoint: 'orders',
          operation: 'getOrders',
          query: {
            CreatedAfter: moment(syncRecord.syncDate).format(),
            MarketplaceIds: account.marketplaces.map(
              (marketplace) => marketplace.marketplaceId
            ),
            NextToken: typeof NextToken == 'string' ? NextToken : '',
          },
        });

        orders.push(...response.Orders);

        NextToken = response.NextToken ? response.NextToken : null;
      } catch (error) {
        done(new Error(error));
      }
    }

    const { syncRecordId } = await SyncRecord.create({
      accountId,
      pendingReports: orders.length,
      totalReports: orders.length,
      syncType: 'hourly',
      dataType: 'orders',
      status: orders.length ? 'STARTED' : 'COMPLETED',
      completedAt: orders.length ? null : Date.now(),
      syncDate: Date.now(),
    });

    let multiplier = 1;
    orders.map(async (order) => {
      const spRequest = await SpRequest.create({
        syncRecordId,
        status: 'PENDING',
        startDate: moment(syncRecord.syncDate).format(),
        endDate: moment().format(),
      });

      delay = 1000 * 60 * multiplier;

      const saveJob = await updateOrder.add(
        {
          spRequestId: spRequest.spRequestId,
          amazonOrderId: order.AmazonOrderId,
        },
        { ...options, delay }
      );

      await spRequest.update({
        jobId: saveJob.id,
        message: 'Fetching order records pending on queue.',
      });

      multiplier++;
    });

    done(null, {});
  } catch (error) {
    console.log(error);
    done(new Error('Error Creating Cron'));
  }
});

queue.on('completed', async (job) => {
  console.log(moment().format() + ' - Update Order Completed');
});

// Queue waiting event hooks
queue.on('waiting', async function (jobId) {
  console.log(moment().format() + ' - Update Order Waiting - ' + jobId);
});

queue.on('failed', function (job, result) {
  console.log(moment().format() + ' - Update Order Failed');
});

queue.on('progress', function (job, result) {
  console.log('progress');
});

queue.on('error', function (err) {
  console.log('error');
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log(moment().format() + ' - Update Order Active');
});

module.exports = queue;
