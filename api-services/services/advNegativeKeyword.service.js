const { Op } = require('sequelize');
const { pick } = require('lodash');
const moment = require('moment');

const {
  findAllAdvNegativeKeyword,
  bulkCreateAdvNegativeKeyword,
  advNegativeKeywordAttributes,
  findAndCountAllAdvNegativeKeyword,
} = require('../repositories/advNegativeKeyword.repository');

const { paginate } = require('./pagination.service');

const { AdvCampaign } = require('../repositories/advCampaign.repository');

const { AdvAdGroup } = require('../repositories/advAdGroup.repository');

const {
  saveChanges,
  checkIfChangesAlreadySaved,
} = require('./advChangeCollection.service');

const getAdvNegativeKeywords = async (advProfileId, query) => {
  const { filter, pageSize, page, pageOffset, sort, search } = query;
  const { campaignType } = filter;

  let options = {
    where: pick(filter, advNegativeKeywordAttributes),
    include: {
      model: AdvAdGroup,
      required: true,
      attributes: ['advCampaignId', 'advAdGroupId', 'name'],
      include: {
        model: AdvCampaign,
        required: true,
        attributes: ['name'],
        where: { advProfileId, campaignType },
      },
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

  const { rows, count } = await findAndCountAllAdvNegativeKeyword(options);

  return paginate(rows, count, page, pageOffset, pageSize);
};

/**
 * Get negative keywords associated to advAdGroupId.
 *
 * @param {biging} advAdGroupId
 * @param {object} query
 * @returns
 */
const getAdvNegativeKeywordsByAdGroupId = async (advAdGroupId, query) => {
  const { filter, pageSize, page, pageOffset, sort } = query;

  let options = {
    where: {
      advAdGroupId,
      ...pick(filter, advNegativeKeywordAttributes),
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

  const { rows, count } = await findAndCountAllAdvNegativeKeyword(options);

  return { count, page, pageSize, rows };
};

const getAdvNegativeKeywordsByIds = async (advNegativeKeywordIds) => {
  const advNegativeKeywords = await findAllAdvNegativeKeyword({
    where: {
      advNegativeKeywordId: { [Op.in]: advNegativeKeywordIds },
    },
    order: [['updatedAt', 'DESC']],
  });

  return advNegativeKeywords;
};

const bulkSyncAdvNegativeKeywords = async (
  advProfileId,
  campaignType,
  negativeKeywords,
  userId = null,
  saveLogs = true,
  optimization = null
) => {
  if (!negativeKeywords.length) return;
  let recentlyUpdatedNegKeywords = [];
  let recentlyUpdatedNegKeywordIds = [];

  const records = negativeKeywords.map((negKeyword) => {
    let obj = {
      ...negKeyword,
      advAdGroupId: negKeyword.adGroupId,
      advNegativeKeywordId: negKeyword.keywordId,
      syncAt: new Date(),
    };

    if ('creationDate' in negKeyword && 'lastUpdatedDate' in negKeyword) {
      obj.createdAt = new Date(negKeyword.creationDate);
      obj.updatedAt = new Date(negKeyword.lastUpdatedDate);
    }

    return pick(obj, advNegativeKeywordAttributes);
  });

  if (saveLogs) {
    recentlyUpdatedNegKeywordIds = records
      .filter((record) => record.updatedAt)
      .map((r) => r.advNegativeKeywordId);

    if (recentlyUpdatedNegKeywordIds.length) {
      recentlyUpdatedNegKeywords = await getAdvNegativeKeywordsByIds(
        recentlyUpdatedNegKeywordIds
      );
    }
  }

  await bulkCreateAdvNegativeKeyword(records, {
    updateOnDuplicate: advNegativeKeywordAttributes.filter(
      (attr) => attr in records[0]
    ),
  });

  if (saveLogs && recentlyUpdatedNegKeywordIds.length) {
    const newlyUpdatedNegKeywords = await getAdvNegativeKeywordsByIds(
      recentlyUpdatedNegKeywordIds
    );

    for (const newData of newlyUpdatedNegKeywords) {
      const { advNegativeKeywordId, advAdGroupId, updatedAt } = newData;
      const advCampaignId = negativeKeywords.find(
        (k) => k.keywordId.toString() === advNegativeKeywordId.toString()
      ).campaignId;

      const saved = await checkIfChangesAlreadySaved({
        advNegativeKeywordId,
        recordType: 'negativeKeyword',
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
            advNegativeKeywordId,
            advAdGroupId,
            advCampaignId,
            recordType: 'negativeKeyword',
            activityDate: updatedAt,
            previousData: recentlyUpdatedNegKeywords.find(
              (a) => a.advNegativeKeywordId === advNegativeKeywordId
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
  getAdvNegativeKeywords,
  getAdvNegativeKeywordsByAdGroupId,
  bulkSyncAdvNegativeKeywords,
};
