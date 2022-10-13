const JSONbig = require('json-bigint');
const moment = require('moment');

const OptimizationRepository = require('@features/advertising/optimization/optimization.repository');

const { bulkSyncAdvCampaigns } = require('../../services/advCampaign.service');
const { bulkSyncAdvAdGroups } = require('../../services/advAdGroup.service');
const { bulkSyncAdvKeywords } = require('../../services/advKeyword.service');

const {
  bulkSyncAdvProductAds,
} = require('../../services/advProductAd.service');

const {
  bulkSyncAdvNegativeKeywords,
} = require('../../services/advNegativeKeyword.service');

const {
  bulkSyncAdvCampaignNegativeKeywords,
} = require('../../services/advCampaignNegativeKeyword.service');

const saveHistoryQueue = require('../advSnapshots/saveHistory');

const createNewKeywordToNewCampaign = async (job) => {
  const { advOptimizationId } = job.data;
  let optimization = null;

  return new Promise(async (resolve, reject) => {
    try {
      optimization = await OptimizationRepository.findById(advOptimizationId, {
        include: ['batch', 'reportItem'],
      });

      const { data, batch } = optimization;

      const apiClient = await batch.advProfile.apiClient({
        maxRetry: 3,
      });

      const fromDate = moment().utc().valueOf();

      const { campaignId } = await saveCampaign(apiClient, optimization);

      const { adGroupId } = await saveAdGroup(
        apiClient,
        optimization,
        campaignId
      );

      await saveKeywords(apiClient, optimization, campaignId, adGroupId);

      await saveProductAds(apiClient, optimization, campaignId, adGroupId);

      if (data.negativeKeywords.length) {
        await saveNegativeKeywords(
          apiClient,
          optimization,
          campaignId,
          adGroupId
        );
      }

      if (data.convertAsNegativeKeywordOn) {
        data.convertAsNegativeKeywordOn === 'campaigns'
          ? await convertToCampaignNegativeKeyword(apiClient, optimization)
          : await convertToNegativeKeyword(apiClient, optimization);
      }

      const status = 'SUCCESS';
      await optimization.update({ status });

      const toDate = moment().utc().add(10, 's').valueOf();

      const parents = [
        { useProfileIdAdvertiser: true, campaignId: campaignId.toString() },
      ];

      await saveHistoryQueue.add(
        'manual',
        {
          advProfileId: batch.advProfile.advProfileId,
          userId: batch.userId,
          payload: {
            fromDate,
            toDate,
            sort: { key: 'DATE', direction: 'DESC' },
            eventTypes: {
              AD: { parents },
              KEYWORD: { parents },
              AD_GROUP: { parents },
              NEGATIVE_KEYWORD: { parents },
              PRODUCT_TARGETING: { parents },
              NEGATIVE_PRODUCT_TARGETING: { parents },
              CAMPAIGN: { eventTypeIds: [campaignId.toString()] },
            },
          },
        },
        { delay: 1000 * 60 * 3 }
      );

      return resolve({ advOptimizationId, status });
    } catch (error) {
      if (optimization) {
        await optimization.update({
          status: 'ERROR',
          errorMessage: error.message,
        });
      }
      return reject(error);
    }
  });
};

const addLogs = async (optimization, log) => {
  let logs = optimization.logs ? JSONbig.parse(optimization.logs) : [];

  const index = logs.findIndex(({ action }) => action === log.action);

  if (index > -1) {
    logs[index] = log;
  } else {
    logs.push(log);
  }

  await optimization.update({ logs: JSONbig.stringify(logs) });
};

const saveCampaign = async (apiClient, optimization) => {
  const { campaignType, userId } = optimization.batch;
  const { profileId: advProfileId } = apiClient.options;

  let campaignData = optimization.data.campaign;

  campaignData.startDate = moment(campaignData.startDate).format('YYYYMMDD');
  if (campaignData.endDate) {
    campaignData.endDate = moment(campaignData.endDate).format('YYYYMMDD');
  }

  const payload = [campaignData];

  let campaignLog = { action: 'createCampaigns', payload };

  return new Promise(async (resolve, reject) => {
    try {
      const [response] = await apiClient.createCampaigns(campaignType, payload);
      campaignLog.response = response;

      const { code, campaignId } = response;

      if (code === 'SUCCESS') {
        const campaign = await apiClient.getCampaign(
          campaignType,
          campaignId,
          true
        );

        await bulkSyncAdvCampaigns(
          advProfileId,
          campaignType,
          [campaign],
          userId,
          false,
          optimization
        );
      }

      await addLogs(optimization, campaignLog);

      return code === 'SUCCESS' ? resolve(response) : reject(response);
    } catch (error) {
      await addLogs(optimization, campaignLog);

      return reject(error);
    }
  });
};

const saveAdGroup = async (apiClient, optimization, campaignId) => {
  const { campaignType, userId } = optimization.batch;
  const { profileId: advProfileId } = apiClient.options;

  const payload = [{ ...optimization.data.adGroup, campaignId }];
  let adGroupLog = { action: 'createAdGroups', payload };

  return new Promise(async (resolve, reject) => {
    try {
      const [response] = await apiClient.createAdGroups(campaignType, payload);

      adGroupLog.response = response;
      const { code, adGroupId } = response;

      if (code === 'SUCCESS') {
        const adGroup = await apiClient.getAdGroup(
          campaignType,
          adGroupId,
          true
        );

        await bulkSyncAdvAdGroups(
          advProfileId,
          campaignType,
          [adGroup],
          userId,
          false,
          optimization
        );
      }

      await addLogs(optimization, adGroupLog);

      return code === 'SUCCESS' ? resolve(response) : reject(response);
    } catch (error) {
      await addLogs(optimization, adGroupLog);

      return reject(error);
    }
  });
};

const saveKeywords = async (apiClient, optimization, campaignId, adGroupId) => {
  const { campaignType, userId } = optimization.batch;
  const { profileId: advProfileId } = apiClient.options;

  const payload = optimization.data.keywords.map((keyword) => {
    return { ...keyword, adGroupId, campaignId };
  });

  let keywordsLog = { action: 'createKeywords', payload };

  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiClient.createKeywords(campaignType, payload);
      keywordsLog.response = response;

      if (response.some((r) => r.code === 'SUCCESS')) {
        const keywords = await apiClient.listKeywords(
          campaignType,
          { adGroupIdFilter: adGroupId },
          true
        );

        await bulkSyncAdvKeywords(
          advProfileId,
          campaignType,
          keywords,
          userId,
          false,
          optimization
        );
      }

      await addLogs(optimization, keywordsLog);

      return response.some((r) => r.code === 'SUCCESS')
        ? resolve(response)
        : reject(response);
    } catch (error) {
      await addLogs(optimization, keywordsLog);

      return reject(error);
    }
  });
};

const saveProductAds = async (
  apiClient,
  optimization,
  campaignId,
  adGroupId
) => {
  const { campaignType, userId } = optimization.batch;
  const { profileId: advProfileId } = apiClient.options;

  const payload = optimization.data.productAds.map((productAd) => {
    return { ...productAd, adGroupId, campaignId };
  });

  let productAdsLog = { action: 'createProductAds', payload };

  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiClient.createProductAds(campaignType, payload);
      productAdsLog.response = response;

      if (response.some((r) => r.code === 'SUCCESS')) {
        const productAds = await apiClient.listProductAds(
          campaignType,
          { adGroupIdFilter: adGroupId },
          true
        );

        await bulkSyncAdvProductAds(
          advProfileId,
          campaignType,
          productAds,
          userId,
          false,
          optimization
        );
      }

      await addLogs(optimization, productAdsLog);

      return response.some((r) => r.code === 'SUCCESS')
        ? resolve(response)
        : reject(response);
    } catch (error) {
      await addLogs(optimization, productAdsLog);

      return reject(error);
    }
  });
};

const saveNegativeKeywords = (
  apiClient,
  optimization,
  campaignId,
  adGroupId
) => {
  return new Promise(async (resolve, reject) => {
    const { campaignType, userId } = optimization.batch;
    const { profileId: advProfileId } = apiClient.options;

    const payload = optimization.data.negativeKeywords.map((negKeyword) => {
      return { ...negKeyword, adGroupId, campaignId };
    });

    let negKeywordsLog = { action: 'createNegativeKeywords', payload };

    try {
      const response = await apiClient.createNegativeKeywords(
        campaignType,
        payload
      );
      negKeywordsLog.response = response;

      if (response.some((r) => r.code === 'SUCCESS')) {
        const negKeywords = await apiClient.listNegativeKeywords(
          campaignType,
          { adGroupIdFilter: adGroupId },
          true
        );

        await bulkSyncAdvNegativeKeywords(
          advProfileId,
          campaignType,
          negKeywords,
          userId,
          false,
          optimization
        );
      }

      await addLogs(optimization, negKeywordsLog);

      return response.some((r) => r.code === 'SUCCESS')
        ? resolve(response)
        : reject(response);
    } catch (error) {
      await addLogs(optimization, negKeywordsLog);

      return reject(error);
    }
  });
};

const convertToNegativeKeyword = (apiClient, optimization) => {
  return new Promise(async (resolve, reject) => {
    const { campaignType, userId } = optimization.batch;
    const { profileId: advProfileId } = apiClient.options;

    let negKeywordsLog = { action: 'createNegativeKeywords' };

    try {
      const payload = [
        {
          keywordText: optimization.reportItem.values.query,
          campaignId: optimization.reportItem.advCampaignId,
          adGroupId: optimization.reportItem.advAdGroupId,
          matchType: 'negativeExact',
          state: 'enabled',
        },
      ];

      negKeywordsLog.payload = payload;

      const [response] = await apiClient.createNegativeKeywords(
        campaignType,
        payload
      );

      negKeywordsLog.response = response;

      const { code, keywordId } = response;

      if (code === 'SUCCESS') {
        const negativeKeyword = await apiClient.getNegativeKeyword(
          campaignType,
          keywordId,
          true
        );

        await bulkSyncAdvNegativeKeywords(
          advProfileId,
          campaignType,
          [negativeKeyword],
          userId,
          false,
          optimization
        );
      }

      await addLogs(optimization, negKeywordsLog);

      return code === 'SUCCESS' ? resolve(response) : reject(response);
    } catch (error) {
      await addLogs(optimization, negKeywordsLog);

      return reject(error);
    }
  });
};

const convertToCampaignNegativeKeyword = (apiClient, optimization) => {
  return new Promise(async (resolve, reject) => {
    const { campaignType, userId } = optimization.batch;
    const { profileId: advProfileId } = apiClient.options;

    let campaignNegKeywordsLog = {
      action: 'createCampaignNegativeKeywords',
    };

    try {
      const payload = [
        {
          keywordText: optimization.reportItem.values.query,
          campaignId: optimization.reportItem.advCampaignId,
          matchType: 'negativeExact',
          state: 'enabled',
        },
      ];

      campaignNegKeywordsLog.payload = payload;

      const [response] = await apiClient.createCampaignNegativeKeywords(
        campaignType,
        payload
      );
      campaignNegKeywordsLog.response = response;

      const { code, keywordId } = response;

      if (code === 'SUCCESS') {
        const campaignNegKeyword = await apiClient.getCampaignNegativeKeyword(
          campaignType,
          keywordId,
          true
        );

        await bulkSyncAdvCampaignNegativeKeywords(
          advProfileId,
          campaignType,
          [campaignNegKeyword],
          userId,
          false,
          optimization
        );
      }

      await addLogs(optimization, campaignNegKeywordsLog);

      return code === 'SUCCESS' ? resolve(response) : reject(response);
    } catch (error) {
      await addLogs(optimization, campaignNegKeywordsLog);

      return reject(error);
    }
  });
};

module.exports = createNewKeywordToNewCampaign;
