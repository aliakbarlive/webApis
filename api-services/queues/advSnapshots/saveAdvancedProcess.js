const moment = require('moment');
const { Op } = require('sequelize');
const { uniqBy } = require('lodash');

const {
  SyncReport,
  SyncRecord,
  AdvProfile,
  AdvAdGroup,
} = require('../../models');

const { bulkSyncAdvCampaigns } = require('../../services/advCampaign.service');
const { bulkSyncAdvAdGroups } = require('../../services/advAdGroup.service');

const {
  bulkSyncAdvCampaignNegativeKeywords,
} = require('../../services/advCampaignNegativeKeyword.service');

const { bulkSyncAdvKeywords } = require('../../services/advKeyword.service');

const {
  bulkSyncAdvNegativeKeywords,
} = require('../../services/advNegativeKeyword.service');

const {
  bulkSyncAdvNegativeTargets,
} = require('../../services/advNegativeTarget.service');

const {
  bulkSyncAdvProductAds,
} = require('../../services/advProductAd.service');

const { bulkSyncAdvTargets } = require('../../services/advTarget.service');

module.exports = async (job) => {
  return new Promise(async (resolve, reject) => {
    try {
      const syncReport = await SyncReport.findByPk(job.data.syncReportId, {
        include: {
          model: SyncRecord,
          as: 'syncRecord',
        },
      });

      const {
        advProfileId,
        campaignType,
        recordType,
        extended,
        advanced = false,
      } = syncReport.meta;

      if (!advanced && syncReport.syncRecord.syncType !== 'initial') {
        throw new Error('Not Advanced Snapshot');
      }

      const advProfile = await AdvProfile.findByPk(advProfileId);

      const apiClient = await advProfile.apiClient({
        maxWaitTime: 10000,
        maxRetry: 1,
      });

      const { getListFn, process } = getSyncProvider(recordType);

      await job.progress(10);

      const count = 5000;
      let hasNext = true;
      let totalCount = 0;

      while (hasNext) {
        let records = await apiClient[getListFn](
          campaignType,
          { startIndex: totalCount, count, stateFilter: 'enabled,paused' },
          extended
        );

        if (records.length) {
          if (recordType === 'keywords' || recordType === 'targets') {
            const recordsWithoutBid = records.filter((record) => !record.bid);

            if (recordsWithoutBid.length) {
              const adGroups = await AdvAdGroup.findAll({
                where: {
                  advAdGroupId: {
                    [Op.in]: uniqBy(recordsWithoutBid, 'adGroupId').map(
                      (record) => record.adGroupId
                    ),
                  },
                },
              });

              records = records.map((record) => {
                if (!record.bid) {
                  const adGroup = adGroups.find(
                    (adGroup) => adGroup.advAdGroupId == record.adGroupId
                  );

                  if (adGroup) record.bid = adGroup.defaultBid;
                }
                return record;
              });
            }
          }

          let recordsToSync = records;

          if (syncReport.syncRecord.syncType !== 'initial') {
            recordsToSync = recordsToSync.filter((record) => {
              return record.lastUpdatedDate
                ? moment(new Date(record.lastUpdatedDate)).isAfter(
                    moment().subtract(7, 'days')
                  )
                : true;
            });
          }

          if (recordsToSync.length) {
            await process(
              advProfile.advProfileId,
              campaignType,
              recordsToSync,
              null,
              false
            );
          }
        }

        await job.log(`Saving ${records.length}.`);

        totalCount = totalCount + records.length;
        hasNext = records.length === count;
      }

      await job.progress(100);

      return resolve({
        syncReportId: syncReport.syncReportId,
        sandbox: advProfile.sandbox,
        count: totalCount,
        advProfileId,
        campaignType,
        recordType,
        advanced,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

const getSyncProvider = (recordType) => {
  const syncProviders = {
    targets: {
      modelName: 'AdvTarget',
      getListFn: 'listTargets',
      process: bulkSyncAdvTargets,
    },
    adGroups: {
      modelName: 'AdvAdGroup',
      getListFn: 'listAdGroups',
      process: bulkSyncAdvAdGroups,
    },
    keywords: {
      modelName: 'AdvKeyword',
      getListFn: 'listKeywords',
      process: bulkSyncAdvKeywords,
    },
    campaigns: {
      modelName: 'AdvCampaign',
      getListFn: 'listCampaigns',
      process: bulkSyncAdvCampaigns,
    },
    productAds: {
      modelName: 'AdvProductAd',
      getListFn: 'listProductAds',
      process: bulkSyncAdvProductAds,
    },
    negativeTargets: {
      modelName: 'AdvNegativeTarget',
      getListFn: 'listNegativeTargets',
      process: bulkSyncAdvNegativeTargets,
    },
    negativeKeywords: {
      modelName: 'AdvNegativeKeyword',
      getListFn: 'listNegativeKeywords',
      process: bulkSyncAdvNegativeKeywords,
    },
    campaignNegativeKeywords: {
      modelName: 'AdvCampaignNegativeKeyword',
      getListFn: 'listCampaignNegativeKeywords',
      process: bulkSyncAdvCampaignNegativeKeywords,
    },
  };

  return syncProviders[recordType];
};
