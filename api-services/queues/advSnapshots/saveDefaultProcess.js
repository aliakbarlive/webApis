const { Op } = require('sequelize');
const { chunk, uniqBy } = require('lodash');

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
        endpoint,
        advanced = false,
      } = syncReport.meta;

      if (advanced) {
        throw new Error('Advanced Snapshot');
      }

      const advProfile = await AdvProfile.findByPk(advProfileId);

      const apiClient = await advProfile.apiClient({
        maxWaitTime: 120000,
      });

      await job.progress(10);

      let records = await apiClient.getSnapshot(
        endpoint,
        syncReport.referenceId
      );

      const chunkRecords = chunk(records, 5000);

      const syncProvider = {
        targets: bulkSyncAdvTargets,
        adGroups: bulkSyncAdvAdGroups,
        keywords: bulkSyncAdvKeywords,
        campaigns: bulkSyncAdvCampaigns,
        productAds: bulkSyncAdvProductAds,
        negativeTargets: bulkSyncAdvNegativeTargets,
        negativeKeywords: bulkSyncAdvNegativeKeywords,
        campaignNegativeKeywords: bulkSyncAdvCampaignNegativeKeywords,
      };

      for (let chunkRecord of chunkRecords) {
        if (recordType === 'keywords' || recordType === 'targets') {
          const recordsWithoutBid = chunkRecord.filter((record) => !record.bid);

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

            chunkRecord = chunkRecord.map((record) => {
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

        await syncProvider[recordType](
          advProfileId,
          campaignType,
          chunkRecord,
          null,
          false
        );
      }

      await job.progress(100);

      return resolve({
        syncReportId: syncReport.syncReportId,
        sandbox: advProfile.sandbox,
        count: records.length,
        campaignType,
        advProfileId,
        recordType,
        advanced,
      });
    } catch (error) {
      return reject(error);
    }
  });
};
