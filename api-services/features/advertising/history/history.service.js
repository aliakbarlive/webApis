const HistoryRepository = require('./history.repository');
const { CampaignRepository } = require('../campaign');
const { AdGroupRepository } = require('../adGroup');
const { ProductAdRepository } = require('../productAd');
const { paginate } = require('@services/pagination.service');
const Response = require('@utils/response');

const getGroupedHistoryByProfileId = async (advProfileId, options = {}) => {
  const { page, pageSize, pageOffset } = options;

  const { count, rows } = await HistoryRepository.findAndCountAllGrouped({
    ...options,
    advProfileId,
  });

  return new Response()
    .withData(paginate(rows, count.length, page, pageOffset, pageSize))
    .withMessage('Grouped history successfully fetched');
};

const listHistoryByProfileId = async (advProfileId, options = {}) => {
  const { page, pageSize, pageOffset } = options;

  let { count, rows } = await HistoryRepository.findAndCountAll({
    ...options,
    advProfileId,
  });

  rows = rows.map((row) => row.toJSON());

  const campaignIds = rows
    .filter(
      (row) => row.changeType === 'CREATED' && row.entityType === 'CAMPAIGN'
    )
    .map((row) => row.entityId);

  if (campaignIds.length) {
    const campaigns = await CampaignRepository.findAllByCampaignIds(
      campaignIds
    );

    rows = rows.map((row) => {
      const campaign = campaigns.find(
        (c) => c.advCampaignId.toString() === row.entityId.toString()
      );

      if (campaign) row.metadata.name = campaign.name;
      return row;
    });
  }

  const adGroupIds = rows
    .filter(
      (row) => row.changeType === 'CREATED' && row.entityType === 'AD_GROUP'
    )
    .map((row) => row.entityId);

  if (adGroupIds.length) {
    const adGroups = await AdGroupRepository.findAllByAdGroupIds(adGroupIds);

    rows = rows.map((row) => {
      const adGroup = adGroups.find(
        (c) => c.advAdGroupId.toString() === row.entityId.toString()
      );

      if (adGroup) row.metadata.name = adGroup.name;
      return row;
    });
  }

  const adIds = rows
    .filter((row) => row.entityType === 'AD')
    .map((row) => row.entityId);

  if (adIds.length) {
    const ads = await ProductAdRepository.findAllByIds(adIds);

    rows = rows.map((row) => {
      const ad = ads.find(
        (c) => c.advProductAdId.toString() === row.entityId.toString()
      );

      if (ad) row.metadata.asin = ad.asin;
      return row;
    });
  }

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('History list successfully fetched');
};

module.exports = { getGroupedHistoryByProfileId, listHistoryByProfileId };
