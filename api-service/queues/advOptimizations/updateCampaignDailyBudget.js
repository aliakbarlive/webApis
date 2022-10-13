const moment = require('moment');
const JSONbig = require('json-bigint');

const OptimizationRepository = require('@features/advertising/optimization/optimization.repository');

const { bulkSyncAdvCampaigns } = require('../../services/advCampaign.service');
const saveHistoryQueue = require('../advSnapshots/saveHistory');

const updateCampaignDailyBudget = async (job) => {
  const { campaignType, advOptimizationId } = job.data;

  return new Promise(async (resolve, reject) => {
    let status = 'ERROR';
    let optimization = null;
    let logs = [];

    try {
      optimization = await OptimizationRepository.findById(advOptimizationId, {
        include: ['batch'],
      });

      const { batch, optimizableId: campaignId } = optimization;

      const apiClient = await batch.advProfile.apiClient();

      const payload = [
        { campaignId, dailyBudget: optimization.data.dailyBudget },
      ];

      logs.push({ action: 'updateCampaigns', payload });
      const fromDate = moment().utc().valueOf();

      const [response] = await apiClient.updateCampaigns(campaignType, payload);
      logs[0].response = response;

      const toDate = moment().utc().add(10, 's').valueOf();

      // Update advCampaign.
      if (response.code === 'SUCCESS') {
        status = response.code;
        const campaign = await apiClient.getCampaign(
          campaignType,
          campaignId,
          true
        );

        await bulkSyncAdvCampaigns(
          batch.advProfile.advProfileId,
          campaignType,
          [campaign],
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
              eventTypes: { CAMPAIGN: { eventTypeIds: [campaignId] } },
              filters: ['BUDGET_AMOUNT'],
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

module.exports = updateCampaignDailyBudget;
