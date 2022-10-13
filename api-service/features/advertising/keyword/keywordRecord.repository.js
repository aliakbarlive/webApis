const { pick } = require('lodash');
const { Op } = require('sequelize');

const {
  AdvCampaign,
  AdvAdGroup,
  AdvKeyword,
  AdvKeywordRecord,
} = require('@models');

const AdvertisingRepository = require('../advertising.repository');
const KeywordRepository = require('./keyword.repository');

class KeywordRecordRepository extends AdvertisingRepository {
  constructor(model) {
    super(model);
  }

  async getSummaryByProfileId(profileId, options) {
    let { attributes, dateRange, ...filter } = options;

    attributes = await super.attributesToQueryStatement(attributes, false);

    const data = await super.findOne({
      attributes,
      where: {
        date: {
          [Op.gte]: dateRange.startDate,
          [Op.lte]: dateRange.endDate,
        },
      },
      include: {
        attributes: [],
        model: AdvKeyword,
        where: pick(filter, KeywordRepository.getAttributes()),
        required: true,
        include: {
          model: AdvAdGroup,
          required: true,
          attributes: [],
          include: {
            model: AdvCampaign,
            attributes: [],
            required: true,
            where: {
              advProfileId: profileId,
              targetingType: 'manual',
            },
          },
        },
      },
      group: ['AdvKeyword->AdvAdGroup->AdvCampaign.advProfileId'],
    });

    return data;
  }

  async findMaxByProfileId(profileId, options) {
    const { dateRange, attribute, sort } = options;

    const attributes = await super.attributesToQueryStatement(
      [attribute],
      false
    );

    const order = super.formatSort(sort, false);

    const data = await super.findOne({
      attributes,
      where: {
        date: {
          [Op.gte]: dateRange.startDate,
          [Op.lte]: dateRange.endDate,
        },
      },
      include: {
        attributes: [],
        model: AdvKeyword,
        required: true,
        include: {
          model: AdvAdGroup,
          required: true,
          attributes: [],
          include: {
            model: AdvCampaign,
            attributes: [],
            required: true,
            where: { advProfileId: profileId },
          },
        },
      },
      group: ['AdvKeyword.advKeywordId'],
      order,
    });

    return data;
  }
}

module.exports = new KeywordRecordRepository(AdvKeywordRecord);
