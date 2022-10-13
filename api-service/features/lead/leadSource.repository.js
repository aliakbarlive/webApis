const moment = require('moment');
const { LeadSource, User } = require('@models');
const { Op, literal, fn, wheres } = require('sequelize');
const BaseRepository = require('../base/base.repository');
moment.tz.setDefault('America/Toronto');

class LeadSourceRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountLinkedInAccounts(options) {
    let { sort, pageSize, pageOffset } = options;

    const { rows, count } = await super.findAndCountAll({
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });

    return { rows, count };
  }

  async findAndCountSources(options) {
    let { sort, pageSize, pageOffset, startDate, endDate} = options;

    let where = {};

    if (startDate && endDate) {
      const startDateStr = moment(startDate)
        .startOf('day')
        .tz('2022-08-02 14:12:45+00', 'America/Los_Angeles')
        .format();
      const endDateStr = moment(endDate)
        .endOf('day')
        .tz('2022-08-02 14:12:45+00', 'America/Los_Angeles')
        .format();

      where.createdAt = {
        [Op.gte]: startDateStr,
        [Op.lte]: endDateStr,
      };
    }

    const { rows, count } = await super.findAndCountAll({
      limit: pageSize,
      offset: pageOffset,
      order: sort,
      where,
      include: [
        {
          model: User,
          as: 'uploadedByUser',
          attributes: ['userId', 'firstName', 'lastName'],
          required: false,
        },
      ],
    });

    return { rows, count };
  }
}

module.exports = new LeadSourceRepository(LeadSource);
