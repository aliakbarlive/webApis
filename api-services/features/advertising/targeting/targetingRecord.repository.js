const { Op } = require('sequelize');

const {
  AdvCampaign,
  AdvAdGroup,
  AdvTargeting,
  AdvTargetingRecord,
} = require('@models');

const AdvertisingRepository = require('../advertising.repository');

class TargetingRecordRepository extends AdvertisingRepository {
  constructor(model) {
    super(model);
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
        model: AdvTargeting,
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
      group: ['AdvTargeting.advTargetingId'],
      order,
    });

    return data;
  }
}

module.exports = new TargetingRecordRepository(AdvTargetingRecord);
