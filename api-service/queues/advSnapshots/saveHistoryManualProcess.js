const { AdvProfile, AdvHistory } = require('../../models');

const sleep = require('../../utils/sleep');

module.exports = async (job) => {
  return new Promise(async (resolve, reject) => {
    const { advProfileId, userId, payload } = job.data;

    try {
      const advProfile = await AdvProfile.findByPk(advProfileId);

      const apiClient = await advProfile.apiClient({
        maxWaitTime: 10000,
        maxRetry: 5,
      });

      let histories = await getHistories(apiClient, payload);

      if (histories.length) {
        histories = histories.map((history) => {
          let obj = {
            userId,
            ...history,
            advProfileId,
            advAdGroupId: history.metadata.adGroupId,
            advCampaignId:
              history.entityType === 'CAMPAIGN'
                ? history.entityId
                : history.metadata.campaignId,
          };

          return obj;
        });

        await AdvHistory.bulkCreate(histories, {
          updateOnDuplicate: [
            'metadata',
            'previousValue',
            'newValue',
            'userId',
          ],
        });
      }

      await job.progress(100);

      return resolve({ advProfileId, userId, payload });
    } catch (error) {
      return reject(error);
    }
  });
};

const getHistories = async (apiClient, params) => {
  let histories = [];

  let hasNext = true;
  let pageOffset = 0;

  while (hasNext) {
    await sleep(500);

    let payload = { ...params, pageOffset };

    const response = await apiClient.apiRequest('history', payload, 'POST');

    histories.push(...response.events);

    pageOffset = pageOffset + 1;
    hasNext = pageOffset < response.maxPageNumber;
  }

  return histories;
};
