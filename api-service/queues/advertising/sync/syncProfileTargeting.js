'use strict';

const { chunk, pick, keys } = require('lodash');
const Queue = require('bull');
const dotenv = require('dotenv');

const {
  AdvCampaign,
  AdvAdGroup,
  AdvKeyword,
  AdvTarget,
  AdvTargeting,
  AdvTargetRecord,
  AdvKeywordRecord,
  AdvTargetingRecord,
} = require('../../../models');

dotenv.config({ path: 'config/config.env' });

let queue = new Queue('Profile Targeting Sync', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  settings: {
    lockDuration: 1200000,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
  },
});

if (process.env.MODE === 'queue') {
  queue.process(async (job) => {
    const { advProfileId } = job.data;

    return new Promise(async (resolve, reject) => {
      try {
        const targetingRecordsAttr = keys(AdvTargetingRecord.rawAttributes);

        const defaultQuery = {
          model: AdvAdGroup,
          required: true,
          attributes: [],
          include: {
            model: AdvCampaign,
            required: true,
            attributes: [],
            where: { advProfileId },
          },
        };

        const keywords = await AdvKeyword.findAll({
          attributes: [
            'advKeywordId',
            'advAdGroupId',
            'matchType',
            'keywordText',
          ],
          include: defaultQuery,
        });

        let keywordRecords = await AdvKeywordRecord.findAll({
          include: {
            model: AdvKeyword,
            required: true,
            include: defaultQuery,
          },
        });

        if (keywordRecords.length) {
          keywordRecords = keywordRecords.map((record) => {
            let obj = {
              ...record.toJSON(),
              advTargetingId: `K-${record.advKeywordId}`,
            };

            return pick(obj, targetingRecordsAttr);
          });

          await AdvTargetingRecord.bulkCreate(keywordRecords, {
            updateOnDuplicate: targetingRecordsAttr,
          });
        }

        if (keywords.length) {
          const chunkKeywords = chunk(keywords, 5000);

          for (const chunkKeyword of chunkKeywords) {
            const keywordTargets = chunkKeyword.map((keyword) => {
              return {
                advTargetingId: `K-${keyword.advKeywordId}`,
                matchType: keyword.matchType,
                advKeywordId: keyword.advKeywordId,
                advAdGroupId: keyword.advAdGroupId,
                value: keyword.keywordText,
                type: 'keyword',
              };
            });

            await AdvTargeting.bulkCreate(keywordTargets, {
              updateOnDuplicate: [
                'matchType',
                'advKeywordId',
                'advAdGroupId',
                'value',
              ],
            });
          }
        }

        const productTargets = await AdvTarget.findAll({
          attributes: ['advTargetId', 'advAdGroupId', 'targetingText'],
          include: defaultQuery,
        });

        let productTargetRecords = await AdvTargetRecord.findAll({
          include: {
            model: AdvTarget,
            required: true,
            include: defaultQuery,
          },
        });

        if (productTargetRecords.length) {
          productTargetRecords = productTargetRecords.map((record) => {
            let obj = {
              ...record.toJSON(),
              advTargetingId: `T-${record.advTargetId}`,
            };

            return pick(obj, targetingRecordsAttr);
          });

          await AdvTargetingRecord.bulkCreate(productTargetRecords, {
            updateOnDuplicate: targetingRecordsAttr,
          });
        }

        if (productTargets.length) {
          const chunkProductTargets = chunk(productTargets, 5000);

          for (const chunkProductTarget of chunkProductTargets) {
            const productTargetings = chunkProductTarget.map((targeting) => {
              return {
                advTargetingId: `T-${targeting.advTargetId}`,
                advTargetId: targeting.advTargetId,
                advAdGroupId: targeting.advAdGroupId,
                value: targeting.targetingText,
                type: 'product',
              };
            });

            await AdvTargeting.bulkCreate(productTargetings, {
              updateOnDuplicate: ['advTargetId', 'advAdGroupId', 'value'],
            });
          }
        }

        return resolve({
          keywords: keywords.length,
          productTargets: productTargets.length,
          keywordRecords: keywordRecords.length,
          productTargetRecords: productTargetRecords.length,
        });
      } catch (error) {
        return reject(error);
      }
    });
  });

  queue.on('completed', async function (job, result) {});

  queue.on('failed', async function (job, result) {});

  queue.on('active', async function (job, err) {});

  queue.on('error', function (err) {
    console.log(err);
  });
}

module.exports = queue;
