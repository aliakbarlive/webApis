const { NotificationChange } = require('@models');
const { Op } = require('sequelize');
const NotificationObject = require('../../models/notificationObject');

const BaseRepository = require('../base/base.repository');

class NotificationChangeRepository extends BaseRepository {
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

  async createWithObject(payload) {
    const output = await super.create(payload, {
      include: { model: NotificationObject, as: 'notificationObject' },
    });

    return output;
  }
}

module.exports = new NotificationChangeRepository(NotificationChange);
