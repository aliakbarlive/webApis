const { NotificationObject, NotificationChange } = require('@models');
const { Op } = require('sequelize');

const BaseRepository = require('../base/base.repository');

class NotificationObjectRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async createWithAssociations(payload) {
    const output = await super.create(payload, {
      include: { model: NotificationChange, as: 'notificationChange' },
    });

    return output;
  }
}

module.exports = new NotificationObjectRepository(NotificationObject);
