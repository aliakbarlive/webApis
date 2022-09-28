const JSONbig = require('json-bigint');

const moment = require('moment');
const OptimizationRepository = require('@features/advertising/optimization/optimization.repository');

const { bulkSyncAdvKeywords } = require('../../services/advKeyword.service');
const saveHistoryQueue = require('../advSnapshots/saveHistory');

const updateKeywordBid = async (job) => {
  const { campaignType, advOptimizationId } = job.data;

  return new Promise(async (resolve, reject) => {
    let status = 'ERROR';
    let optimization = null;
    let logs = [];

    try {
      optimization = await OptimizationRepository.findById(advOptimizationId, {
        include: ['batch'],
      });

      const { batch, optimizableId: keywordId } = optimization;

      const apiClient = await batch.advProfile.apiClient();

      const payload = [
        {
          keywordId,
          bid: optimization.data.bid,
        },
      ];

      logs.push({ action: 'updateKeywords', payload });
      const fromDate = moment().utc().valueOf();

      const [response] = await apiClient.updateKeywords(campaignType, payload);
      logs[0].response = response;
      const toDate = moment().utc().add(10, 's').valueOf();

      if (response.code === 'SUCCESS') {
        status = response.code;

        let keyword = await apiClient.getKeyword(campaignType, keywordId, true);
        keyword.bidUpdatedAt = new Date();

        await bulkSyncAdvKeywords(
          batch.advProfile.advProfileId,
          campaignType,
          [keyword],
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
              eventTypes: { KEYWORD: { eventTypeIds: [keywordId] } },
              filters: ['BID_AMOUNT'],
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

module.exports = updateKeywordBid;
