const { NotificationEntityType } = require('@models');
const { Op } = require('sequelize');

const BaseRepository = require('../base/base.repository');

class NotificationEntityTypeRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountAll(options) {
    let { sort, pageSize, pageOffset } = options;

    const { rows, count } = await super.findAndCountAll({
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });

    return { rows, count };
  }
}

module.exports = new NotificationEntityTypeRepository(NotificationEntityType);
