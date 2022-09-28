const moment = require('moment');
const { pick, keys } = require('lodash');
const { literal, cast, Op } = require('sequelize');
const { AdvHistory, AdvCampaign, User } = require('@models');

const BaseRepository = require('../../base/base.repository');

class HistoryRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountAll(options = {}) {
    const { page, pageSize, pageOffset, sort, ...filter } = options;

    return await super.findAndCountAll({
      where: pick(filter, super.getAttributes()),
      include: {
        model: AdvCampaign,
        as: 'campaign',
        attributes: [],
        where: pick(filter, keys(AdvCampaign.rawAttributes)),
      },
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });
  }

  async findAndCountAllGrouped(options = {}) {
    const { page, pageSize, pageOffset, sort, startDate, endDate, ...filter } =
      options;

    return await super.findAndCountAll({
      attributes: [
        'timestamp',
        'advCampaignId',
        [cast(literal('COUNT("timestamp")'), 'int'), 'count'],
      ],
      include: [
        {
          model: AdvCampaign,
          as: 'campaign',
          attributes: ['name', 'campaignType'],
          where: pick(filter, keys(AdvCampaign.rawAttributes)),
        },
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName'],
        },
      ],
      group: [
        'timestamp',
        'AdvHistory.advCampaignId',
        'campaign.advCampaignId',
        'user.userId',
      ],
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });
  }
}

module.exports = new HistoryRepository(AdvHistory);
