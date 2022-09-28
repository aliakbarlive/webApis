const {
  AdvCampaign,
  AdvAdGroup,
  AdvTarget,
  AdvTargetRecord,
} = require('@models');

const { Op } = require('sequelize');

const AdvertisingRepository = require('../advertising.repository');

class TargetRecordRepository extends AdvertisingRepository {
  constructor(model) {
    super(model);
  }

  async getSummaryByProfileId(profileId, options) {
    let { attributes, dateRange } = options;

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
        model: AdvTarget,
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
              targetingType: {
                [Op.ne]: 'auto',
              },
            },
          },
        },
      },
      group: ['AdvTarget->AdvAdGroup->AdvCampaign.advProfileId'],
    });

    return data;
  }
}

module.exports = new TargetRecordRepository(AdvTargetRecord);
