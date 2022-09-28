const { Op } = require('sequelize');
const { pick } = require('lodash');
const { AdvNegativeTarget, AdvAdGroup, AdvCampaign } = require('@models');

const BaseRepository = require('../../base/base.repository');

class NegativeTargetRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  /**
   * Find and count all by profileId.
   *
   * @param {bigint} profileId
   * @param {object} options
   * @returns {object}
   */
  async findAndCountAllByProfileId(profileId, options) {
    const { pageSize, pageOffset, include, sort, search, ...filter } = options;

    let queryOptions = {
      where: pick(filter, this.getAttributes()),
      include: {
        model: AdvAdGroup,
        required: true,
        attributes: [],
        include: {
          model: AdvCampaign,
          required: true,
          attributes: [],
          where: { advProfileId: profileId, ...pick(filter, ['campaignType']) },
        },
      },
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    };

    if (search) {
      queryOptions.where.targetingText = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // Include adGroup.
    if (include.includes('adGroup')) {
      queryOptions.include.attributes.push('name', 'advAdGroupId');
      queryOptions.include.include.attributes.push('advCampaignId', 'name');
    }

    const { rows, count } = await super.findAndCountAll(queryOptions);

    return { rows, count };
  }
}

module.exports = new NegativeTargetRepository(AdvNegativeTarget);
