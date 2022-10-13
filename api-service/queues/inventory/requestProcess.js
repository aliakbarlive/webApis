const moment = require('moment');
const {
  SyncRecord,
  SyncReport,
  Marketplace,
  Account,
  AccountMarketplace,
} = require('../../models');
const saveInventoryReport = require('./save');

const requestProcess = async (job, done) => {
  try {
    const { accountId, syncType } = job.data;

    // Bull Options
    const attempts = 10;
    const backoff = 1000 * 60 * 2;
    const options = { attempts, backoff };

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

    // Create initial syncRecord
    const syncRecord = await SyncRecord.create({
      accountId,
      pendingReports: account.marketplaces.length,
      totalReports: account.marketplaces.length,
      syncType,
      dataType: 'inventory',
      status: 'STARTED',
      syncDate: Date.now(),
    });

    const { syncRecordId } = syncRecord;

    const startDate = moment().startOf('day').format();
    const endDate = moment().endOf('day').format();

    account.marketplaces.forEach(async ({ marketplaceId }) => {
      const syncReport = await SyncReport.create({
        syncRecordId,
        startDate,
        endDate,
      });

      const delay = 10000;

      const saveJob = await saveInventoryReport.add(
        { syncReportId: syncReport.syncReportId, marketplaceId },
        {
          ...options,
          delay,
        }
      );

      await syncReport.update({
        jobId: saveJob.id,
        message: 'Fetching inventory records pending on queue.',
      });
    });

    done(null, {});
  } catch (err) {
    done(new Error(err.message));
  }
};

module.exports = requestProcess;
