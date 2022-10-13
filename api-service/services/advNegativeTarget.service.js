const { Op } = require('sequelize');
const { pick } = require('lodash');
const moment = require('moment');

const { AdvCampaign } = require('../repositories/advCampaign.repository');
const { AdvAdGroup } = require('../repositories/advAdGroup.repository');
const { AdvTarget } = require('../repositories/advTarget.repository');

const { paginate } = require('./pagination.service');

const {
  findAllAdvNegativeTarget,
  bulkCreateAdvNegativeTarget,
  advNegativeTargetAttributes,
  findAndCountAllAdvNegativeTarget,
} = require('../repositories/advNegativeTarget.repository');

const {
  saveChanges,
  checkIfChangesAlreadySaved,
} = require('./advChangeCollection.service');

const getAdvNegativeTargets = async (advProfileId, query) => {
  const { filter, pageSize, page, pageOffset, sort, search } = query;
  const { campaignType } = filter;

  let options = {
    where: pick(filter, advNegativeTargetAttributes),
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
    options.where.targetingText = {
      [Op.iLike]: `%${search}%`,
    };
  }

  const { rows, count } = await findAndCountAllAdvNegativeTarget(options);

  return paginate(rows, count, page, pageOffset, pageSize);
};

const getAdvNegativeTargetsByIds = async (advNegativeTargetIds) => {
  const advNegativeTargets = await findAllAdvNegativeTarget({
    where: {
      advNegativeTargetId: { [Op.in]: advNegativeTargetIds },
    },
    order: [['updatedAt', 'DESC']],
  });

  return advNegativeTargets;
};

const bulkSyncAdvNegativeTargets = async (
  advProfileId,
  campaignType,
  negativeTargets,
  userId = null,
  saveLogs = true,
  optimization = null
) => {
  if (!negativeTargets.length) return;
  let recentlyUpdatedNegTargets = [];
  let recentlyUpdatedNegTargetIds = [];

  const records = negativeTargets.map((negTarget) => {
    let obj = {
      ...negTarget,
      advAdGroupId: negTarget.adGroupId,
      advNegativeTargetId: negTarget.targetId,
      targetingText: AdvTarget.formatExpression(negTarget.expression),
      syncAt: new Date(),
    };

    if ('creationDate' in negTarget && 'lastUpdatedDate' in negTarget) {
      obj.createdAt = new Date(negTarget.creationDate);
      obj.updatedAt = new Date(negTarget.lastUpdatedDate);
    }

    return pick(obj, advNegativeTargetAttributes);
  });

  if (saveLogs) {
    recentlyUpdatedNegTargetIds = records
      .filter((record) => record.updatedAt)
      .map((r) => r.advNegativeTargetId);

    if (recentlyUpdatedNegTargetIds.length) {
      recentlyUpdatedNegTargets = await getAdvNegativeTargetsByIds(
        recentlyUpdatedNegTargetIds
      );
    }
  }

  await bulkCreateAdvNegativeTarget(records, {
    updateOnDuplicate: advNegativeTargetAttributes.filter(
      (attr) => attr in records[0]
    ),
  });

  if (saveLogs && recentlyUpdatedNegTargetIds.length) {
    const newlyUpdatedNegTargets = await getAdvNegativeTargetsByIds(
      recentlyUpdatedNegTargetIds
    );

    for (const newData of newlyUpdatedNegTargets) {
      const { advNegativeTargetId, advAdGroupId, updatedAt } = newData;
      const advCampaignId = negativeTargets.find(
        (k) => k.targetId.toString() === advNegativeTargetId.toString()
      ).campaignId;

      const saved = await checkIfChangesAlreadySaved({
        advNegativeTargetId,
        recordType: 'negativeTarget',
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
            advNegativeTargetId,
            advAdGroupId,
            advCampaignId,
            recordType: 'negativeTarget',
            activityDate: updatedAt,
            previousData: recentlyUpdatedNegTargets.find(
              (a) => a.advNegativeTargetId === advNegativeTargetId
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
  getAdvNegativeTargets,
  bulkSyncAdvNegativeTargets,
};
