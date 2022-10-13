const { AdvCampaign, AdvCampaignRecord } = require('@models');
const { pick, keys } = require('lodash');
const { Op } = require('sequelize');

const AdvertisingRepository = require('../advertising.repository');

class CampaignRecordRepository extends AdvertisingRepository {
  constructor(model) {
    super(model);
  }

  async getSummaryByProfileId(profileId, options) {
    let { attributes, dateRange, raw = false } = options;
    let filters = options.filter ?? {};

    if (
      'advCampaignIds' in filters &&
      Array.isArray(filters.advCampaignIds) &&
      filters.advCampaignIds.length
    ) {
      filters.advCampaignId = {
        [Op.in]: filters.advCampaignIds,
      };
    }

    if (
      'advPortfolioIds' in filters &&
      Array.isArray(filters.advPortfolioIds) &&
      filters.advPortfolioIds.length
    ) {
      filters.advPortfolioId = {
        [Op.in]: filters.advPortfolioIds,
      };
    }

    if (
      'states' in filters &&
      Array.isArray(filters.states) &&
      filters.states.length
    ) {
      filters.state = {
        [Op.in]: filters.states,
      };
    }

    if (
      'targetingTypes' in filters &&
      Array.isArray(filters.targetingTypes) &&
      filters.targetingTypes.length
    ) {
      filters.targetingType = {
        [Op.in]: filters.targetingTypes,
      };
    }

    if (
      'campaignTypes' in filters &&
      Array.isArray(filters.campaignTypes) &&
      filters.campaignTypes.length
    ) {
      filters.campaignType = {
        [Op.in]: filters.campaignTypes,
      };
    }

    attributes = super.formatAttributes(attributes, false);

    const data = await super.findOne({
      raw,
      attributes,
      where: {
        date: {
          [Op.gte]: dateRange.startDate,
          [Op.lte]: dateRange.endDate,
        },
      },
      include: {
        attributes: [],
        model: AdvCampaign,
        required: true,
        where: {
          advProfileId: profileId,
          ...pick(filters, keys(AdvCampaign.rawAttributes)),
        },
      },
      group: ['AdvCampaign.advProfileId'],
    });

    return data;
  }

  async findAllByProfileId(profileId, options) {
    let { attributes, dateRange, ...filter } = options;

    if (
      'advCampaignIds' in filter &&
      Array.isArray(filter.advCampaignIds) &&
      filter.advCampaignIds.length
    ) {
      filter.advCampaignId = {
        [Op.in]: filter.advCampaignIds,
      };
    }

    if (
      'advPortfolioIds' in filter &&
      Array.isArray(filter.advPortfolioIds) &&
      filter.advPortfolioIds.length
    ) {
      filter.advPortfolioId = {
        [Op.in]: filter.advPortfolioIds,
      };
    }

    if (
      'states' in filter &&
      Array.isArray(filter.states) &&
      filter.states.length
    ) {
      filter.state = {
        [Op.in]: filter.states,
      };
    }

    if (
      'targetingTypes' in filter &&
      Array.isArray(filter.targetingTypes) &&
      filter.targetingTypes.length
    ) {
      filter.targetingType = {
        [Op.in]: filter.targetingTypes,
      };
    }

    if (
      'campaignTypes' in filter &&
      Array.isArray(filter.campaignTypes) &&
      filter.campaignTypes.length
    ) {
      filter.campaignType = {
        [Op.in]: filter.campaignTypes,
      };
    }

    const data = await super.findAll({
      attributes: this.formatAttributes(attributes),
      where: {
        date: {
          [Op.gte]: dateRange.startDate,
          [Op.lte]: dateRange.endDate,
        },
      },
      include: {
        attributes: [],
        model: AdvCampaign,
        required: true,
        where: {
          advProfileId: profileId,
          ...pick(filter, keys(AdvCampaign.rawAttributes)),
        },
      },
      group: ['date'],
      order: [['date', 'ASC']],
    });

    return data;
  }

  async findSumByProfileId(profileId, options) {
    let { attributes, dateRange, ...filter } = options;

    let defaultData = {};

    attributes.forEach((attr) => (defaultData[attr] = 0));

    if (
      'advCampaignIds' in filter &&
      Array.isArray(filter.advCampaignIds) &&
      filter.advCampaignIds.length
    ) {
      filter.advCampaignId = {
        [Op.in]: filter.advCampaignIds,
      };
    }

    if (
      'advPortfolioIds' in filter &&
      Array.isArray(filter.advPortfolioIds) &&
      filter.advPortfolioIds.length
    ) {
      filter.advPortfolioId = {
        [Op.in]: filter.advPortfolioIds,
      };
    }

    if (
      'states' in filter &&
      Array.isArray(filter.states) &&
      filter.states.length
    ) {
      filter.state = {
        [Op.in]: filter.states,
      };
    }

    if (
      'targetingTypes' in filter &&
      Array.isArray(filter.targetingTypes) &&
      filter.targetingTypes.length
    ) {
      filter.targetingType = {
        [Op.in]: filter.targetingTypes,
      };
    }

    if (
      'campaignTypes' in filter &&
      Array.isArray(filter.campaignTypes) &&
      filter.campaignTypes.length
    ) {
      filter.campaignType = {
        [Op.in]: filter.campaignTypes,
      };
    }

    const data = await super.findOne({
      attributes: this.formatAttributes(attributes),
      where: {
        date: {
          [Op.gte]: dateRange.startDate,
          [Op.lte]: dateRange.endDate,
        },
      },
      include: {
        attributes: [],
        model: AdvCampaign,
        required: true,
        where: {
          advProfileId: profileId,
          ...pick(filter, keys(AdvCampaign.rawAttributes)),
        },
      },
      group: ['AdvCampaign.advProfileId', 'date'],
      order: [['date', 'ASC']],
    });

    return data ? data.toJSON() : defaultData;
  }
}

module.exports = new CampaignRecordRepository(AdvCampaignRecord);
