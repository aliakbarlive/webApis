const { Op } = require('sequelize');
const { pick } = require('lodash');
const moment = require('moment');

const {
  AdvCampaign,
  advCampaignAttributes,
} = require('../repositories/advCampaign.repository');

const {
  AdvAdGroup,
  AdvAdGroupRecord,
  advAdGroupAttributes,
} = require('../repositories/advAdGroup.repository');

const KEY = 'advAdGroupId';

const {
  generatePrevOptions,
  generatePrevDateRange,
  transformAdvertisingListQuery,
  transformAdvertisingStatisticsQuery,
  transformAdvertisingRecordsQuery,
} = require('./advertising.service');

const {
  saveChanges,
  checkIfChangesAlreadySaved,
} = require('./advChangeCollection.service');

/**
 * Get list of ad-groups associated to advProfileId
 *
 * @param {bigint} advProfileId
 * @param {objec} query
 * @returns {object} list
 */
const getAdvAdGroups = async (advProfileId, query, raw = false) => {
  const { pageSize: limit = null, pageOffset: offset = null, include } = query;

  const { filter, attributes, sort, having, dateRange } =
    await transformAdvertisingListQuery(query);

  const options = {
    where: pick(filter, advAdGroupAttributes),
    group: ['AdvAdGroup.advAdGroupId', 'AdvCampaign.advCampaignId'],
    include: [
      {
        model: AdvCampaign,
        attributes: ['name'],
        where: {
          advProfileId,
          ...pick(filter, advCampaignAttributes),
        },
      },
      {
        model: AdvAdGroupRecord,
        as: 'records',
        attributes: [],
        required: false,
        where: dateRange,
      },
    ],
    distinct: true,
    subQuery: false,
    order: sort,
    attributes,
    limit,
    offset,
    having,
    raw,
  };

  if (query.search) {
    options.where.name = {
      [Op.iLike]: `%${query.search}%`,
    };
  }

  let { rows, count } = await AdvAdGroup.findAndCountAll(options);

  if (include && include.includes('previousData')) {
    const prevDateRange = generatePrevDateRange(query.dateRange);
    const prevOptions = generatePrevOptions(options, rows, prevDateRange, KEY);

    const adGroups = await AdvAdGroup.findAll(prevOptions);

    rows = rows.map((row) => {
      return {
        ...row.toJSON(),
        previousData: adGroups.find((adGroup) => adGroup[KEY] === row[KEY]),
      };
    });
  }

  return { rows, count: count.length };
};

/**
 * Get Ad Group details by id.
 *
 * @param {bigint} advProfileId
 * @param {bigint} advAdGroupId
 * @param {boolean} allowSync
 * @returns <AdvAdGroup>
 */
const getAdvAdGroupById = async (
  advProfileId,
  advAdGroupId,
  allowSync = false
) => {
  const advAdGroup = await AdvAdGroup.findOne({
    where: {
      advAdGroupId,
    },
    include: {
      model: AdvCampaign,
      required: true,
      attributes: [],
      where: {
        advProfileId,
      },
    },
  });

  if (allowSync && advAdGroup) {
    await advAdGroup.sync();
  }

  return advAdGroup;
};

/**
 * Get advertising ad group campaign type.
 *
 * @param {AdvAdGroup} advAdGroup
 * @returns {string}
 */
const getAdvAdGroupCampaignType = async (advAdGroup) => {
  const advCampaign = await advAdGroup.getAdvCampaign();

  return advCampaign.campaignType;
};

/**
 * Get adGroup statistics.
 *
 * @param {AdvAdGroup} advAdGroup
 * @param {object} query
 * @returns
 */
const getAdvAdGroupStatistics = async (advAdGroup, query) => {
  query.filter = {
    campaignType: await getAdvAdGroupCampaignType(advAdGroup),
  };

  const { attributes, dateRange } = await transformAdvertisingStatisticsQuery(
    query
  );

  const data = await AdvAdGroupRecord.findOne({
    attributes,
    where: {
      advAdGroupId: advAdGroup.advAdGroupId,
      ...dateRange,
    },
  });

  return data;
};

/**
 * Get Ad Group records.
 *
 * @param {AdvAdGroup} advAdGroup
 * @param {object} query
 * @returns
 */
const getAdvAdGroupRecords = async (advAdGroup, query) => {
  query.filter = {
    campaignType: await getAdvAdGroupCampaignType(advAdGroup),
  };
  const { attributes, dateRange } = await transformAdvertisingRecordsQuery(
    query
  );

  const records = await AdvAdGroupRecord.findAll({
    attributes: ['date', ...attributes],
    where: {
      ...dateRange,
    },
    group: ['date'],
    order: [['date', 'ASC']],
  });

  return records;
};

const getAdvAdGroupsByIds = async (advAdGroupIds) => {
  const adGroups = await AdvAdGroup.findAll({
    where: {
      advAdGroupId: { [Op.in]: advAdGroupIds },
    },
    order: [['updatedAt', 'DESC']],
  });

  return adGroups;
};

const bulkSyncAdvAdGroups = async (
  advProfileId,
  campaignType,
  adGroups,
  userId = null,
  saveLogs = true,
  optimization = null
) => {
  if (!adGroups.length) return;
  let recentlyUpdatedAdGroups = [];
  let recentlyUpdatedAdGroupIds = [];

  const records = adGroups.map((adGroup) => {
    let obj = {
      ...adGroup,
      defaultBid: adGroup.defaultBid ?? adGroup.bid,
      state: adGroup.state ?? 'enabled',
      advAdGroupId: adGroup.adGroupId,
      advCampaignId: adGroup.campaignId,
      name: adGroup.name,
      syncAt: new Date(),
    };

    if ('creationDate' in adGroup && 'lastUpdatedDate' in adGroup) {
      obj.createdAt = new Date(adGroup.creationDate);
      obj.updatedAt = new Date(adGroup.lastUpdatedDate);
    }

    return pick(obj, advAdGroupAttributes);
  });

  if (saveLogs) {
    recentlyUpdatedAdGroupIds = records
      .filter((record) => record.updatedAt)
      .map((r) => r.advAdGroupId);

    if (recentlyUpdatedAdGroupIds.length) {
      recentlyUpdatedAdGroups = await getAdvAdGroupsByIds(
        recentlyUpdatedAdGroupIds
      );
    }
  }

  await AdvAdGroup.bulkCreate(records, {
    updateOnDuplicate: advAdGroupAttributes.filter(
      (attr) => attr in records[0]
    ),
  });

  if (saveLogs && recentlyUpdatedAdGroupIds.length) {
    const newlyUpdatedAdGroups = await getAdvAdGroupsByIds(
      recentlyUpdatedAdGroupIds
    );

    for (const newData of newlyUpdatedAdGroups) {
      const { advAdGroupId, advCampaignId, updatedAt } = newData;

      const saved = await checkIfChangesAlreadySaved({
        advAdGroupId,
        recordType: 'adGroup',
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
            advAdGroupId,
            advCampaignId,
            recordType: 'adGroup',
            activityDate: updatedAt,
            previousData: recentlyUpdatedAdGroups.find(
              (a) => a.advAdGroupId === advAdGroupId
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
  getAdvAdGroups,
  getAdvAdGroupById,
  getAdvAdGroupCampaignType,
  getAdvAdGroupStatistics,
  getAdvAdGroupRecords,
  bulkSyncAdvAdGroups,
};
