const moment = require('moment');
const { Op } = require('sequelize');
const { chunk } = require('lodash');

const {
  AdvProfile,
  AdvCampaign,
  AdvAdGroup,
  AdvKeyword,
  AdvTarget,
  AdvProductAd,
  AdvNegativeTarget,
  AdvNegativeKeyword,
  AdvCampaignNegativeKeyword,
  AdvHistory,
} = require('../../models');

const sleep = require('../../utils/sleep');

module.exports = async (job) => {
  return new Promise(async (resolve, reject) => {
    const [redisClient] = job.queue.clients;

    const { advProfileId, recordType } = job.data;
    const key = `${advProfileId}-${recordType}`;

    try {
      const lastSyncDate = await redisClient.get(key);

      const fromDate =
        lastSyncDate ??
        moment().subtract(7, 'days').utc().startOf('D').valueOf();

      const toDate = moment().utc().valueOf();
      const advProfile = await AdvProfile.findByPk(advProfileId);

      const syncProvider = getSyncProvider(recordType);

      const { rows, count } = await syncProvider.getCampaignIds(
        advProfileId,
        fromDate,
        toDate
      );

      if (count) {
        const apiClient = await advProfile.apiClient({
          maxWaitTime: 10000,
          maxRetry: 1,
        });

        const payloads = chunk(rows, 10).map((chunk) =>
          syncProvider.getPayload(
            fromDate,
            toDate,
            chunk.map((c) => c.advCampaignId)
          )
        );

        let histories = await getHistories(apiClient, payloads);

        if (histories.length) {
          histories = histories.map((history) => {
            let obj = {
              ...history,
              advProfileId,
              advAdGroupId: history.metadata.adGroupId,
              advCampaignId:
                recordType === 'campaigns'
                  ? history.entityId
                  : history.metadata.campaignId,
            };

            return obj;
          });

          await AdvHistory.bulkCreate(histories, {
            updateOnDuplicate: ['metadata', 'previousValue', 'newValue'],
          });
        }
      }

      await redisClient.set(key, toDate);

      await job.progress(100);

      return resolve({ advProfileId, recordType, fromDate, toDate });
    } catch (error) {
      return reject(error);
    }
  });
};

const getHistories = async (apiClient, payloads) => {
  let histories = [];

  for (let params of payloads) {
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
  }

  return histories;
};

const getSyncProvider = (recordType) => {
  const syncProviders = {
    targets: {
      getCampaignIds: async (advProfileId, lastUpdatedFrom, lastUpdatedTo) => {
        return await AdvCampaign.findAndCountAll({
          attributes: ['advCampaignId'],
          where: { advProfileId },
          include: {
            model: AdvAdGroup,
            attributes: [],
            required: true,
            include: {
              model: AdvTarget,
              required: true,
              attributes: [],
              where: {
                lastUpdatedDate: {
                  [Op.gte]: lastUpdatedFrom,
                  [Op.lte]: lastUpdatedTo,
                },
              },
            },
          },
        });
      },
      getPayload: (fromDate, toDate, campaignIds) => {
        return {
          fromDate,
          toDate,
          sort: {
            key: 'DATE',
            direction: 'DESC',
          },
          eventTypes: {
            PRODUCT_TARGETING: {
              parents: campaignIds.map((campaignId) => {
                return {
                  useProfileIdAdvertiser: true,
                  campaignId,
                };
              }),
            },
          },
        };
      },
    },
    adGroups: {
      getCampaignIds: async (advProfileId, lastUpdatedFrom, lastUpdatedTo) => {
        return await AdvCampaign.findAndCountAll({
          attributes: ['advCampaignId'],
          where: { advProfileId },
          include: {
            model: AdvAdGroup,
            required: true,
            attributes: [],
            where: {
              lastUpdatedDate: {
                [Op.gte]: lastUpdatedFrom,
                [Op.lte]: lastUpdatedTo,
              },
            },
          },
        });
      },
      getPayload: (fromDate, toDate, campaignIds) => {
        return {
          fromDate,
          toDate,
          sort: {
            key: 'DATE',
            direction: 'DESC',
          },
          eventTypes: {
            AD_GROUP: {
              parents: campaignIds.map((campaignId) => {
                return {
                  useProfileIdAdvertiser: true,
                  campaignId,
                };
              }),
            },
          },
        };
      },
    },
    keywords: {
      getCampaignIds: async (advProfileId, lastUpdatedFrom, lastUpdatedTo) => {
        return await AdvCampaign.findAndCountAll({
          attributes: ['advCampaignId'],
          where: { advProfileId },
          include: {
            model: AdvAdGroup,
            required: true,
            attributes: [],
            include: {
              model: AdvKeyword,
              required: true,
              attributes: [],
              where: {
                lastUpdatedDate: {
                  [Op.gte]: lastUpdatedFrom,
                  [Op.lte]: lastUpdatedTo,
                },
              },
            },
          },
        });
      },
      getPayload: (fromDate, toDate, campaignIds) => {
        return {
          fromDate,
          toDate,
          sort: {
            key: 'DATE',
            direction: 'DESC',
          },
          eventTypes: {
            KEYWORD: {
              parents: campaignIds.map((campaignId) => {
                return {
                  useProfileIdAdvertiser: true,
                  campaignId,
                };
              }),
            },
          },
        };
      },
    },
    campaigns: {
      getCampaignIds: async (advProfileId, lastUpdatedFrom, lastUpdatedTo) => {
        return await AdvCampaign.findAndCountAll({
          attributes: ['advCampaignId'],
          where: {
            advProfileId,
            lastUpdatedDate: {
              [Op.gte]: lastUpdatedFrom,
              [Op.lte]: lastUpdatedTo,
            },
          },
        });
      },
      getPayload: (fromDate, toDate, campaignIds) => {
        return {
          fromDate,
          toDate,
          sort: { key: 'DATE', direction: 'DESC' },
          eventTypes: {
            CAMPAIGN: {
              filters: [
                'NAME',
                'STATUS',
                'END_DATE',
                'START_DATE',
                'BUDGET_AMOUNT',
                'PLACEMENT_GROUP',
                'SMART_BIDDING_STRATEGY',
              ],
              eventTypeIds: campaignIds.map((campaignId) => campaignId),
            },
          },
        };
      },
    },
    productAds: {
      getCampaignIds: async (advProfileId, lastUpdatedFrom, lastUpdatedTo) => {
        return await AdvCampaign.findAndCountAll({
          attributes: ['advCampaignId'],
          where: { advProfileId },
          include: {
            model: AdvAdGroup,
            required: true,
            attributes: [],
            include: {
              model: AdvProductAd,
              attributes: [],
              required: true,
              where: {
                lastUpdatedDate: {
                  [Op.gte]: lastUpdatedFrom,
                  [Op.lte]: lastUpdatedTo,
                },
              },
            },
          },
        });
      },
      getPayload: (fromDate, toDate, campaignIds) => {
        return {
          fromDate,
          toDate,
          sort: {
            key: 'DATE',
            direction: 'DESC',
          },
          eventTypes: {
            AD: {
              parents: campaignIds.map((campaignId) => {
                return {
                  useProfileIdAdvertiser: true,
                  campaignId,
                };
              }),
            },
          },
        };
      },
    },
    negativeTargets: {
      getCampaignIds: async (advProfileId, lastUpdatedFrom, lastUpdatedTo) => {
        return await AdvCampaign.findAndCountAll({
          attributes: ['advCampaignId'],
          where: { advProfileId },
          include: {
            model: AdvAdGroup,
            required: true,
            attributes: [],
            include: {
              model: AdvNegativeTarget,
              required: true,
              attributes: [],
              where: {
                lastUpdatedDate: {
                  [Op.gte]: lastUpdatedFrom,
                  [Op.lte]: lastUpdatedTo,
                },
              },
            },
          },
        });
      },
      getPayload: (fromDate, toDate, campaignIds) => {
        return {
          fromDate,
          toDate,
          sort: {
            key: 'DATE',
            direction: 'DESC',
          },
          eventTypes: {
            NEGATIVE_PRODUCT_TARGETING: {
              parents: campaignIds.map((campaignId) => {
                return {
                  useProfileIdAdvertiser: true,
                  campaignId,
                };
              }),
            },
          },
        };
      },
    },
    negativeKeywords: {
      getCampaignIds: async (advProfileId, lastUpdatedFrom, lastUpdatedTo) => {
        return await AdvCampaign.findAndCountAll({
          attributes: ['advCampaignId'],
          where: { advProfileId },
          include: {
            model: AdvAdGroup,
            required: true,
            attributes: [],
            include: {
              model: AdvNegativeKeyword,
              required: true,
              attributes: [],
              where: {
                lastUpdatedDate: {
                  [Op.gte]: lastUpdatedFrom,
                  [Op.lte]: lastUpdatedTo,
                },
              },
            },
          },
        });
      },
      getPayload: (fromDate, toDate, campaignIds) => {
        return {
          fromDate,
          toDate,
          sort: {
            key: 'DATE',
            direction: 'DESC',
          },
          eventTypes: {
            NEGATIVE_KEYWORD: {
              parents: campaignIds.map((campaignId) => {
                return {
                  useProfileIdAdvertiser: true,
                  campaignId,
                };
              }),
            },
          },
        };
      },
    },
    campaignNegativeKeywords: {
      getCampaignIds: async (advProfileId, lastUpdatedFrom, lastUpdatedTo) => {
        return await AdvCampaign.findAndCountAll({
          attributes: ['advCampaignId'],
          where: { advProfileId },
          include: {
            model: AdvCampaignNegativeKeyword,
            required: true,
            attributes: [],
            where: {
              lastUpdatedDate: {
                [Op.gte]: lastUpdatedFrom,
                [Op.lte]: lastUpdatedTo,
              },
            },
          },
        });
      },
      getPayload: (fromDate, toDate, campaignIds) => {
        return {
          fromDate,
          toDate,
          sort: {
            key: 'DATE',
            direction: 'DESC',
          },
          eventTypes: {
            NEGATIVE_KEYWORD: {
              parents: campaignIds.map((campaignId) => {
                return {
                  useProfileIdAdvertiser: true,
                  campaignId,
                };
              }),
            },
          },
        };
      },
    },
  };

  return syncProviders[recordType];
};
