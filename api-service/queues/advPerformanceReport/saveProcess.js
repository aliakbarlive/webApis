const {
  AdvReportEntity,
  AdvSearchTerm,
  AdvKeyword,
  AdvTarget,
  AdvProfile,
  SyncReport,
} = require('../../models');

const Models = require('../../models');

const { chunk, uniq, cloneDeep } = require('lodash');
const { faker } = require('@faker-js/faker');

module.exports = async (job) => {
  return new Promise(async (resolve, reject) => {
    try {
      const syncReport = await SyncReport.findByPk(job.data.syncReportId);

      const { advReportEntityId, advProfileId } = syncReport.meta;

      const advProfile = await AdvProfile.findByPk(advProfileId);
      const reportEntity = await AdvReportEntity.findByPk(advReportEntityId);

      await job.progress(10);

      const advApiClient = await advProfile.apiClient();

      let records = [];
      records = await advApiClient.getReport(syncReport.referenceId);

      records = records
        .filter((record) => record.impressions)
        .map((record) => {
          let obj = {
            ...record,
            advCampaignId: record.campaignId,
            advProfileId: advProfile.advProfileId,
            campaignType: reportEntity.campaignType,
            date: syncReport.date,
            accountId: advProfile.accountId,
            advAdGroupId: record.adGroupId,
            advKeywordId: record.keywordId,
            advProductAdId: record.adId,
            advTargetId: record.targetId,
            sales:
              reportEntity.campaignType === 'sponsoredProducts'
                ? record.attributedSales7d
                : record.attributedSales14d,
            orders:
              reportEntity.campaignType === 'sponsoredProducts'
                ? record.attributedConversions7d
                : record.attributedConversions14d,
            unitsSold:
              reportEntity.campaignType === 'sponsoredProducts'
                ? record.attributedUnitsOrdered7d
                : record.attributedUnitsOrdered14d,
          };

          if (reportEntity.campaignType === 'sponsoredBrands') {
            obj.unitsSold =
              record.unitsSold14d ?? record.attributedUnitsOrderedNewToBrand14d;
          }

          if (
            reportEntity.campaignType === 'sponsoredDisplay' &&
            record.costType === 'VCPM'
          ) {
            obj.orders = obj.viewAttributedConversions14d;
            obj.sales = obj.viewAttributedSales14d;
            obj.unitsSold = obj.viewAttributedUnitsOrdered14d;
          }

          return obj;
        });

      await syncReport.update({
        message: `Saving ${records.length} records.`,
      });

      const { campaignType, recordType } = reportEntity;
      const chunkRecords = chunk(records, 5000);

      await saveRecordsInChunk(job, advProfile, reportEntity, chunkRecords);

      await job.progress(100);

      return resolve({
        syncReportId: syncReport.syncReportId,
        count: records.length,
        campaignType,
        recordType,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * Save records in chunks.
 *
 * @param Job job
 * @param AdvProfile advProfile
 * @param AdvReportEntity reportEntity
 * @param array records
 * @returns Promise
 */
const saveRecordsInChunk = async (job, advProfile, reportEntity, records) => {
  const { advEntity } = reportEntity;
  const { sandbox } = advProfile;
  const chunkCount = records.length;

  return new Promise(async (resolve, reject) => {
    try {
      for (let [index, chunkRecord] of records.entries()) {
        if (advEntity == 'AdvSearchTerm') {
          chunkRecord = await saveSearchTerms(chunkRecord, sandbox);
        }

        await saveAdvEntityRecords(reportEntity.advEntity, chunkRecord);

        const progressPercentage = Math.round(((index + 1) / chunkCount) * 90);
        await job.progress(progressPercentage);
      }
      return resolve(records);
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * Save AdvSearchTerms to database.
 *
 * @param array records
 * @returns Promise
 */
const saveSearchTerms = async (records, sandbox) => {
  return new Promise(async (resolve, reject) => {
    let newRecords = [];
    try {
      for (let record of records) {
        let valid = true;
        if (record.keywordId && sandbox) {
          valid = await AdvKeyword.findByPk(record.keywordId);
        }

        if (record.targetId && sandbox) {
          valid = await AdvTarget.findByPk(record.targetId);
        }

        if (valid) {
          const [advSearchTerm] = await AdvSearchTerm.findOrCreate({
            where: {
              advCampaignId: record.campaignId,
              advAdGroupId: record.adGroupId,
              advTargetId: record.targetId ?? null,
              advKeywordId: record.keywordId ?? null,
              target: record.keywordId ? 'keyword' : 'product',
              query: sandbox ? faker.commerce.productName() : record.query,
            },
          });
          record.advSearchTermId = advSearchTerm.advSearchTermId;
          newRecords.push(record);
        }
      }

      return resolve(newRecords);
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * Save Entity records to database.
 *
 * @param string entity
 * @param array records
 */
const saveAdvEntityRecords = async (entity, records) => {
  const unchangedRecords = cloneDeep(records);

  const attrs = Object.keys(Models[`${entity}Record`].rawAttributes);

  const recordsReference = cloneDeep(records).map((record) => {
    Object.keys(record).forEach((key) => {
      if (!attrs.includes(key)) {
        delete record[key];
      }
    });
    return record;
  });

  await Models[`${entity}Record`].bulkCreate(recordsReference, {
    updateOnDuplicate: attrs,
  });

  if (entity === 'AdvKeyword' || entity === 'AdvTarget') {
    await saveAggregatedTargetingRecords(entity, unchangedRecords);
  }
};

const saveAggregatedTargetingRecords = async (entity, records) => {
  const recordAttrs = Object.keys(Models['AdvTargetingRecord'].rawAttributes);
  const attrs = Object.keys(Models['AdvTargeting'].rawAttributes);

  const formattedRecords = cloneDeep(records).map((record) => {
    record.value = record.keywordText ?? record.targetingText;
    record.advTargetingId =
      entity === 'AdvKeyword'
        ? `K-${record.advKeywordId}`
        : `T-${record.advTargetId}`;
    record.type = entity === 'AdvKeyword' ? 'keyword' : 'product';

    return record;
  });

  const recordsCpy = cloneDeep(formattedRecords);

  await Models[`AdvTargetingRecord`].bulkCreate(
    recordsCpy.slice().map((record) => {
      Object.keys(record).forEach((key) => {
        if (!recordAttrs.includes(key)) {
          delete record[key];
        }
      });
      return record;
    }),
    {
      updateOnDuplicate: recordAttrs,
    }
  );

  await Models[`AdvTargeting`].bulkCreate(
    uniq([...formattedRecords], 'advTargetingId')
      .map((r) => {
        const reference = formattedRecords.find(
          (fr) => fr.advTargetingId === r.advTargetingId
        );

        return reference;
      })
      .map((record) => {
        Object.keys(record).forEach((key) => {
          if (!attrs.includes(key)) {
            delete record[key];
          }
        });
        return record;
      }),
    {
      updateOnDuplicate: attrs,
    }
  );
};
