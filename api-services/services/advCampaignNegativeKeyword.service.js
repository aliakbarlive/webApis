const { Op } = require('sequelize');
const { pick } = require('lodash');
const moment = require('moment');

const { AdvCampaign } = require('../repositories/advCampaign.repository');

const {
  findAllAdvCampaignNegativeKeyword,
  bulkCreateAdvCampaignNegativeKeyword,
  advCampaignNegativeKeywordAttributes,
  findAndCountAllAdvCampaignNegativeKeyword,
} = require('../repositories/advCampaignNegativeKeyword.repository');

const {
  saveChanges,
  checkIfChangesAlreadySaved,
} = require('./advChangeCollection.service');

const { paginate } = require('./pagination.service');

/**
 * Get campaign negative keywords associated to advProfileId.
 *
 * @param bigint advProfileId
 * @param object query
 * @returns object
 */
const getAdvCampaignNegativeKeywords = async (advProfileId, query) => {
  const { filter, pageSize, page, pageOffset, sort, search } = query;

  let options = {
    where: pick(filter, advCampaignNegativeKeywordAttributes),
    include: {
      model: AdvCampaign,
      where: {
        advProfileId,
        campaignType: filter.campaignType,
      },
      attributes: ['name'],
    },
    limit: pageSize,
    offset: pageOffset,
    order: sort,
  };

  if (search) {
    options.where.keywordText = {
      [Op.iLike]: `%${search}%`,
    };
  }

  const { rows, count } = await findAndCountAllAdvCampaignNegativeKeyword(
    options
  );

  return paginate(rows, count, page, pageOffset, pageSize);
};

/**
 * Get negative keywords associated to advCampaignId.
 *
 * @param {biging} advCampaignId
 * @param {object} query
 * @returns
 */
const getAdvCampaignNegativeKeywordsByCampaignId = async (
  advCampaignId,
  query
) => {
  const { filter, pageSize, pageOffset, sort } = query;

  let options = {
    where: {
      advCampaignId,
      ...pick(filter, advCampaignNegativeKeywordAttributes),
    },
    limit: pageSize,
    offset: pageOffset,
    order: sort,
  };

  if (query.search) {
    options.where.keywordText = {
      [Op.iLike]: `%${query.search}%`,
    };
  }

  const { rows, count } = await findAndCountAllAdvCampaignNegativeKeyword(
    options
  );

  return { rows, count, pageSize, pageOffset };
};

const getAdvCampaignNegativeKeywordsByIds = async (
  advCampaignNegativeKeywordIds
) => {
  const advCampaignNegativeKeywords = await findAllAdvCampaignNegativeKeyword({
    where: {
      advCampaignNegativeKeywordId: { [Op.in]: advCampaignNegativeKeywordIds },
    },
    order: [['updatedAt', 'DESC']],
  });

  return advCampaignNegativeKeywords;
};

const bulkSyncAdvCampaignNegativeKeywords = async (
  advProfileId,
  campaignType,
  campaignNegativeKeywords,
  userId = null,
  saveLogs = true,
  optimization = null
) => {
  if (!campaignNegativeKeywords.length) return;
  let recentlyUpdatedCampaignNegKeywords = [];
  let recentlyUpdatedCampaignNegKeywordIds = [];

  const records = campaignNegativeKeywords.map((campaignNegKeyword) => {
    let obj = {
      ...campaignNegKeyword,
      advCampaignId: campaignNegKeyword.campaignId,
      advCampaignNegativeKeywordId: campaignNegKeyword.keywordId,
      syncAt: new Date(),
      createdAt: campaignNegKeyword.creationDate,
    };

    if (
      'creationDate' in campaignNegKeyword &&
      'lastUpdatedDate' in campaignNegKeyword
    ) {
      obj.createdAt = new Date(campaignNegKeyword.creationDate);
      obj.updatedAt = new Date(campaignNegKeyword.lastUpdatedDate);
    }

    return pick(obj, advCampaignNegativeKeywordAttributes);
  });

  if (saveLogs) {
    recentlyUpdatedCampaignNegKeywordIds = records
      .filter((record) => record.updatedAt)
      .map((r) => r.advCampaignNegativeKeywordId);

    if (recentlyUpdatedCampaignNegKeywordIds.length) {
      recentlyUpdatedCampaignNegKeywords =
        await getAdvCampaignNegativeKeywordsByIds(
          recentlyUpdatedCampaignNegKeywordIds
        );
    }
  }

  await bulkCreateAdvCampaignNegativeKeyword(records, {
    updateOnDuplicate: advCampaignNegativeKeywordAttributes.filter(
      (attr) => attr in records[0]
    ),
  });

  if (saveLogs && recentlyUpdatedCampaignNegKeywordIds.length) {
    const newlyUpdatedNegKeywords = await getAdvCampaignNegativeKeywordsByIds(
      recentlyUpdatedCampaignNegKeywordIds
    );

    for (const newData of newlyUpdatedNegKeywords) {
      const { advCampaignNegativeKeywordId, advCampaignId, updatedAt } =
        newData;

      const saved = await checkIfChangesAlreadySaved({
        advCampaignNegativeKeywordId,
        recordType: 'campaignNegativeKeyword',
        activityDate: updatedAt,
      });

      let advOptimizationBatchId = null;
      let activityDate = updatedAt;

      if (optimization) {
        advOptimizationBatchId = optimization.batch.advOptimizationBatchId;
        activityDate = optimization.batch.processedAt;
      }

      if (!saved) {
        await saveChanges(
          advProfileId,
          campaignType,
          activityDate,
          userId,
          advOptimizationBatchId,
          {
            advCampaignNegativeKeywordId,
            advCampaignId,
            recordType: 'campaignNegativeKeyword',
            activityDate: updatedAt,
            previousData: recentlyUpdatedCampaignNegKeywords.find(
              (a) =>
                a.advCampaignNegativeKeywordId === advCampaignNegativeKeywordId
            ),
            advOptimizationId: optimization
              ? optimization.advOptimizationId
              : null,
            newData,
          }
        );
      }
    }
  }
};

module.exports = {
  getAdvCampaignNegativeKeywords,
  bulkSyncAdvCampaignNegativeKeywords,
  getAdvCampaignNegativeKeywordsByCampaignId,
};
