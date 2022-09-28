const { pick, keys } = require('lodash');
const {
  AdvChangeCollection,
  AdvChange,
  AdvCampaign,
  User,
} = require('../models');

const { getReadableDifference } = require('./advChanges.service');
const { paginate } = require('./pagination.service');

const listAdvChangeCollectionsByAdvProfileId = async (advProfileId, query) => {
  const { filter, page, pageSize, pageOffset, sort, include } = query;
  return paginate([], 0, page, pageOffset, pageSize);

  let options = {
    include: [
      {
        model: AdvChange,
        as: 'changes',
        required: true,
        where: { hasSystemDiff: true },
        include: [],
      },
    ],
    where: {
      advProfileId,
      ...pick(filter, keys(AdvChangeCollection.rawAttributes)),
    },
    offset: pageOffset,
    limit: pageSize,
    order: sort,
  };

  if (include.includes('user')) {
    options.include.push({
      model: User,
      as: 'user',
      attributes: ['firstName', 'lastName'],
    });
  }

  if (include.includes('campaign')) {
    options.include[0].include.push({
      model: AdvCampaign,
      as: 'campaign',
      attributes: ['name'],
    });
  }

  const { rows, count } = await AdvChangeCollection.findAndCountAll(options);

  return paginate(rows, count, page, pageOffset, pageSize);
};

const checkIfChangesAlreadySaved = async (options) => {
  const count = await AdvChange.count({ where: options });
  return !!count;
};

const saveChanges = async (
  advProfileId,
  campaignType,
  activityDate,
  userId,
  advOptimizationBatchId,
  data
) => {
  const [collection, created] = await AdvChangeCollection.findOrCreate({
    where: {
      activityDate,
      advProfileId,
      campaignType,
      userId,
      advOptimizationBatchId,
    },
  });

  const { previousData, newData, recordType } = data;
  let description = getReadableDifference(recordType, previousData, newData);

  await AdvChange.create({
    ...data,
    description,
    hasSystemDiff: !!description,
    advChangeCollectionId: collection.advChangeCollectionId,
  });
};

module.exports = {
  saveChanges,
  checkIfChangesAlreadySaved,
  listAdvChangeCollectionsByAdvProfileId,
};
