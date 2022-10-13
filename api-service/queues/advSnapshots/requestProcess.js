const {
  Account,
  SyncRecord,
  AdvProfile,
  Marketplace,
  AdvReportEntity,
  SyncReport,
} = require('../../models');

const moment = require('moment');
const { Op } = require('sequelize');
const saveSnapshotQueue = require('./save');
const generateSnapshotQueue = require('./generate');

const requestProcess = async (job) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { accountId, syncType, advanced = false } = job.data;

      const account = await Account.findByPk(accountId);
      let advProfiles = [];

      const apiClient = await account.advApiClient({
        sandbox: account.sellingPartnerId.toLowerCase().includes('test'),
        region: 'na',
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
        dataType: 'advSnapshots',
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

          let entities = await AdvReportEntity.scope('snapshot').findAll(
            options
          );

          if (!advanced) {
            entities = entities.filter(
              (entity) =>
                entity.campaignType !== 'sponsoredBrands' &&
                entity.recordType !== 'adGroups'
            );
          }

          const reports = await SyncReport.bulkCreate(
            entities.map((entity) => {
              const { campaignType, recordType, extended, endpoint } = entity;

              return {
                syncRecordId: syncRecord.syncRecordId,
                date: moment().format('YYYYMMDD'),
                meta: {
                  advProfileId: advProfile.advProfileId,
                  advReportEntityId: entity.advReportEntityId,
                  campaignType,
                  recordType,
                  endpoint,
                  extended,
                  advanced,
                },
              };
            })
          );

          await syncRecord.increment(['pendingReports', 'totalReports'], {
            by: reports.length,
          });

          for (const report of reports) {
            if (advanced || syncType === 'initial') {
              await saveSnapshotQueue.add(
                'advanced',
                { syncReportId: report.syncReportId },
                {
                  attempts: 3,
                  backoff: 6000,
                }
              );
            } else {
              await generateSnapshotQueue.add(
                { syncReportId: report.syncReportId },
                { attempts: 3 }
              );
            }
          }

          const percent = Math.round(((index + 1) / advProfiles.length) * 50);
          await job.progress(percent);
        })
      );

      await job.progress(100);

      if (advProfiles.length === 0) {
        await syncRecord.markAs('PROCESSED');
      }

      return resolve(syncRecord.toJSON());
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = requestProcess;
