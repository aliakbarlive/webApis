const { Op } = require('sequelize');
const { pick } = require('lodash');
const { AdvCampaignNegativeKeyword, AdvCampaign } = require('@models');

const BaseRepository = require('../../base/base.repository');

class CampaignNegativeKeywordRepository extends BaseRepository {
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
        model: AdvCampaign,
        required: true,
        attributes: [],
        where: { advProfileId: profileId, ...pick(filter, ['campaignType']) },
      },
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    };

    if (search) {
      queryOptions.where.keywordText = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // Include campaign.
    if (include.includes('campaign')) {
      queryOptions.include.attributes.push('name', 'advCampaignId');
    }

    const { rows, count } = await super.findAndCountAll(queryOptions);

    return { rows, count };
  }
}

module.exports = new CampaignNegativeKeywordRepository(
  AdvCampaignNegativeKeyword
);
