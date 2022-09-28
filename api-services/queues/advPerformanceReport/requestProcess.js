const { Op } = require('sequelize');
const {
  Account,
  Marketplace,
  SyncRecord,
  SyncReport,
  AdvProfile,
  AdvReportEntity,
} = require('../../models');

const { range } = require('lodash');
const moment = require('moment');
const generateReport = require('./generate');

const requestProcess = async (job) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { accountId, syncType } = job.data;
      const account = await Account.findByPk(accountId);
      let advProfiles = [];

      const apiClient = await account.advApiClient({
        sandbox: account.sellingPartnerId.toLowerCase().includes('test'),
        region: 'na',
        maxRetry: 3,
        maxWaitTime: 2000,
      });

      let profiles = await apiClient.listProfiles();
      profiles = profiles
        .filter((profile) => profile.accountInfo.type == 'seller')
        .map((profile) => {
          const { dailyBudget, profileId, timezone, accountInfo } = profile;
          return {
            timezone,
            dailyBudget,
            accountId,
            advProfileId: profileId,
            marketplaceId: accountInfo.marketplaceStringId,
          };
        });

      if (profiles.length) {
        await AdvProfile.bulkCreate(profiles, {
          updateOnDuplicate: ['dailyBudget'],
        });

        advProfiles = await AdvProfile.findAll({
          include: { model: Marketplace, as: 'marketplace' },
          where: {
            advProfileId: {
              [Op.in]: profiles.map((p) => p.advProfileId),
            },
          },
        });
      }

      await job.progress(10);

      const syncRecord = await SyncRecord.create({
        accountId,
        syncType,
        dataType: 'advPerformanceReport',
        syncDate: moment(),
        status: 'STARTED',
      });

      await job.progress(50);

      await Promise.all(
        advProfiles.map(async (advProfile, index) => {
          let options = {
            where: {
              enabled: true,
              marketPlace: {
                [Op.contains]: [advProfile.marketplace.countryCode],
              },
            },
          };

          if (advProfile.sandbox) {
            options.where.campaignType = 'sponsoredProducts';
          }

          const entities = await AdvReportEntity.scope('performance').findAll(
            options
          );

          const syncReports = await SyncReport.bulkCreate(
            reportsData(syncRecord, advProfile.advProfileId, entities)
          );

          await syncRecord.increment(['pendingReports', 'totalReports'], {
            by: syncReports.length,
          });

          for (const syncReport of syncReports) {
            const job = await generateReport.add(
              { syncReportId: syncReport.syncReportId },
              { backoff: 6000, attempts: 3 }
            );

            await syncReport.update({ jobId: job.id });
          }

          const percent = Math.round(((index + 1) / advProfiles.length) * 50);
          await job.progress(percent);
        })
      );

      if (advProfiles.length === 0) {
        await syncRecord.markAs('PROCESSED');
      }

      await job.progress(100);

      return resolve(syncRecord.toJSON());
    } catch (error) {
      return reject(error);
    }
  });
};

const reportsData = (syncRecord, advProfileId, entities) => {
  const { syncType } = syncRecord;
  const dates = reportsDateRange(syncType);

  let reports = [];

  dates.forEach((date) => {
    const reportsPerDate = entities.map((entity) => {
      const { campaignType, recordType } = entity;

      return {
        syncRecordId: syncRecord.syncRecordId,
        date: date.format('YYYYMMDD'),
        meta: {
          advProfileId,
          advReportEntityId: entity.advReportEntityId,
          campaignType,
          recordType,
        },
      };
    });

    reports = [...reports, ...reportsPerDate];
  });

  return reports;
};

const reportsDateRange = (syncType) => {
  const initialSyncDays = parseInt(process.env.INITIAL_SYNC_ADV_DAYS) + 1;
  const cronSyncDays = process.env.CRON_SYNC_ADV_DAYS.split(',');

  const subDays =
    syncType === 'initial' ? range(1, initialSyncDays) : cronSyncDays;

  return subDays
    .reverse()
    .map((subDay) => moment().subtract(parseInt(subDay), 'days'));
};

module.exports = requestProcess;
