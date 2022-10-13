const { Op } = require('sequelize');
const { pick } = require('lodash');
const moment = require('moment');

const {
  AdvCampaign,
  advCampaignAttributes,
} = require('../repositories/advCampaign.repository');

const { AdvAdGroup } = require('../repositories/advAdGroup.repository');

const {
  AdvTarget,
  AdvTargetRecord,
  advTargetAttributes,
  findAllAdvTarget,
} = require('../repositories/advTarget.repository');

const {
  generatePrevOptions,
  generatePrevDateRange,
  transformAdvertisingListQuery,
} = require('./advertising.service');

const {
  saveChanges,
  checkIfChangesAlreadySaved,
} = require('./advChangeCollection.service');

const KEY = 'advTargetId';

/**
 * Get list of advTargets associated to advProfileId
 *
 * @param {bigint} advProfileId
 * @param {objec} query
 * @returns {object} list
 */
const getAdvTargets = async (advProfileId, query, raw = false) => {
  const { pageSize: limit = null, pageOffset: offset = null, include } = query;
  const { filter, attributes, sort, having, dateRange } =
    await transformAdvertisingListQuery(query);

  let options = {
    distinct: true,
    subQuery: false,
    attributes,
    where: pick(filter, advTargetAttributes),
    include: [
      {
        model: AdvTargetRecord,
        as: 'records',
        attributes: [],
        where: dateRange,
        required: false,
      },
      {
        model: AdvAdGroup,
        attributes: ['name'],
        right: true,
        required: true,
        include: [
          {
            model: AdvCampaign,
            attributes: ['name'],
            where: {
              advProfileId,
              ...pick(filter, advCampaignAttributes),
            },
          },
        ],
      },
    ],
    group: [
      'AdvTarget.advTargetId',
      'AdvAdGroup.advAdGroupId',
      'AdvAdGroup->AdvCampaign.advCampaignId',
    ],
    order: sort,
    having,
    limit,
    offset,
    raw,
  };

  if (query.search) {
    options.where.targetingText = {
      [Op.iLike]: `%${query.search}%`,
    };
  }

  let { rows, count } = await AdvTarget.findAndCountAll(options);

  rows = rows.map((row) => row.toJSON());

  if (include && include.includes('previousData')) {
    const prevDateRange = generatePrevDateRange(query.dateRange);
    const prevOptions = generatePrevOptions(options, rows, prevDateRange, KEY);

    const targets = await AdvTarget.findAll(prevOptions);

    rows = rows.map((row) => {
      return {
        ...row,
        previousData: targets.find((target) => target[KEY] === row[KEY]),
      };
    });
  }

  return { rows, count: count.length };
};

const getAdvTargetsByIds = async (advTargetIds) => {
  const targets = await findAllAdvTarget({
    where: {
      advTargetId: { [Op.in]: advTargetIds },
    },
    order: [['updatedAt', 'DESC']],
  });

  return targets;
};

const bulkSyncAdvTargets = async (
  advProfileId,
  campaignType,
  targets,
  userId = null,
  saveLogs = true,
  optimization = null
) => {
  if (!targets.length) return;
  let recentlyUpdatedTargets = [];
  let recentlyUpdatetTargetIds = [];

  const records = targets.map((target) => {
    let obj = {
      ...target,
      targetingText: AdvTarget.formatExpression(target.expression),
      advAdGroupId: target.adGroupId,
      advTargetId: target.targetId,
      syncAt: new Date(),
    };

    if ('creationDate' in target && 'lastUpdatedDate' in target) {
      obj.createdAt = new Date(target.creationDate);
      obj.updatedAt = new Date(target.lastUpdatedDate);
    }

    return pick(obj, advTargetAttributes);
  });

  if (saveLogs) {
    recentlyUpdatetTargetIds = records
      .filter((record) => record.updatedAt)
      .map((r) => r.advTargetId);

    if (recentlyUpdatetTargetIds.length) {
      recentlyUpdatedTargets = await getAdvTargetsByIds(
        recentlyUpdatetTargetIds
      );
    }
  }

  await AdvTarget.bulkCreate(records, {
    updateOnDuplicate: advTargetAttributes.filter((attr) => attr in records[0]),
  });

  if (saveLogs && recentlyUpdatetTargetIds.length) {
    const newlyUpdatedTargets = await getAdvTargetsByIds(
      recentlyUpdatetTargetIds
    );

    for (const newData of newlyUpdatedTargets) {
      const { advTargetId, advAdGroupId, updatedAt } = newData;
      const advCampaignId = targets.find(
        (t) => t.targetId.toString() === advTargetId.toString()
      ).campaignId;

      const saved = await checkIfChangesAlreadySaved({
        advTargetId,
        recordType: 'target',
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
            advTargetId,
            advAdGroupId,
            advCampaignId,
            recordType: 'target',
            activityDate: updatedAt,
            previousData: recentlyUpdatedTargets.find(
              (a) => a.advTargetId === advTargetId
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
  getAdvTargets,
  bulkSyncAdvTargets,
};
