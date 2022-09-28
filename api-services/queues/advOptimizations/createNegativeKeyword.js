const moment = require('moment');
const JSONbig = require('json-bigint');

const OptimizationRepository = require('@features/advertising/optimization/optimization.repository');

const {
  bulkSyncAdvNegativeKeywords,
} = require('../../services/advNegativeKeyword.service');

const saveHistoryQueue = require('../advSnapshots/saveHistory');

const createNegativeKeyword = async (job) => {
  const { campaignType, advOptimizationId } = job.data;

  return new Promise(async (resolve, reject) => {
    let status = 'ERROR';
    let optimization = null;
    let logs = [];

    try {
      optimization = await OptimizationRepository.findById(advOptimizationId, {
        include: ['batch', 'reportItem'],
      });

      const { batch } = optimization;

      const payload = [
        {
          keywordText: optimization.reportItem.values.query,
          campaignId: optimization.reportItem.advCampaignId,
          adGroupId: optimization.reportItem.advAdGroupId,
          matchType: optimization.data.matchType,
          state: 'enabled',
        },
      ];

      const apiClient = await batch.advProfile.apiClient();

      logs.push({ action: 'createNegativeKeywords', payload });

      const fromDate = moment().utc().valueOf();

      const [response] = await apiClient.createNegativeKeywords(
        campaignType,
        payload
      );

      logs[0].response = response;
      const toDate = moment().utc().add(10, 's').valueOf();

      if (response.code === 'SUCCESS') {
        status = response.code;
        const negativeKeyword = await apiClient.getNegativeKeyword(
          campaignType,
          response.keywordId,
          true
        );

        await bulkSyncAdvNegativeKeywords(
          batch.advProfile.advProfileId,
          campaignType,
          [negativeKeyword],
          batch.userId,
          false,
          optimization
        );

        await saveHistoryQueue.add(
          'manual',
          {
            advProfileId: batch.advProfile.advProfileId,
            fromDate,
            toDate,
            userId: batch.userId,
            payload: {
              fromDate,
              toDate,
              sort: { key: 'DATE', direction: 'DESC' },
              eventTypes: {
                NEGATIVE_KEYWORD: {
                  eventTypeIds: [response.keywordId.toString()],
                },
              },
            },
          },
          { delay: 1000 * 60 * 3 }
        );
      }

      await optimization.update({ status, logs: JSONbig.stringify(logs) });

      return resolve({ advOptimizationId, status });
    } catch (error) {
      if (optimization) {
        await optimization.update({
          status: 'ERROR',
          logs: JSONbig.stringify(logs),
          errorMessage: error.message,
        });
      }

      return reject(error);
    }
  });
};

module.exports = createNegativeKeyword;
