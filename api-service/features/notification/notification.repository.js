const {
  Notification,
  NotificationObject,
  NotificationEntityType,
  User,
  AgencyClient,
  Account,
  Subscription,
  Termination,
} = require('@models');
const { t } = require('i18next');
const { Op } = require('sequelize');

const BaseRepository = require('../base/base.repository');

class NotificationRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountAll({ sort, pageSize, pageOffset, recipientId }) {
    let options = {
      limit: pageSize,
      offset: pageOffset,
      where: {},
      order: [sort],
      include: [
        {
          model: User,
          as: 'recipient',
          attributes: ['firstName', 'lastName'],
        },
        {
          model: NotificationObject,
          as: 'notificationObject',
          attributes: ['entityTypeId', 'entityId', 'status'],
          include: {
            model: NotificationEntityType,
            as: 'entityType',
            attributes: ['entity', 'i18nAttribute'],
          },
        },
      ],
      raw: true,
    };

    if (recipientId) {
      options.where.recipientId = recipientId;
    }

    return await super.findAndCountAll(options);
  }

  async getClientsMessages(data) {
    let agencyClientIds = data.map((row) => {
      return row['notificationObject.entityId'];
    });

    const clients = await AgencyClient.findAll({
      attributes: ['agencyClientId', 'client'],
      where: { agencyClientId: { [Op.in]: agencyClientIds } },
      include: {
        model: Account,
        as: 'account',
        attributes: ['accountId'],
        include: {
          model: Subscription,
          as: 'subscription',
          attributes: ['subscriptionId'],
        },
      },
      raw: true,
    });

    let out = data.map((row) => {
      return {
        entityId: row['notificationObject.entityId'],
        entityTypeId: row['notificationObject.entityTypeId'],
        notificationObjectId: row['notificationObjectId'],
        entity: row['notificationObject.entityType.entity'],
        message: t(row['notificationObject.entityType.i18nAttribute'], {
          client: clients.find(
            (d) => d.agencyClientId === row['notificationObject.entityId']
          ).client,
        }),
        createdAt: row['createdAt'],
        status: row['notificationObject.status'],
        new: row['status'],
        id: row['notificationId'],
      };
    });

    return out;
  }

  async getTerminationMessages(data) {
    let terminationIds = data.map((row) => {
      return row['notificationObject.entityId'];
    });

    const terminations = await Termination.findAll({
      attributes: ['terminationId', 'agencyClientId', 'reason'],
      where: { terminationId: { [Op.in]: terminationIds } },
      include: {
        model: AgencyClient,
        as: 'agencyClient',
        attributes: ['client'],
      },
      raw: true,
    });

    let out = data.map((row) => {
      const client = terminations.find(
        (d) => d.terminationId === row['notificationObject.entityId']
      );

      return {
        entityId: row['notificationObject.entityId'],
        entityTypeId: row['notificationObject.entityTypeId'],
        notificationObjectId: row['notificationObjectId'],
        entity: row['notificationObject.entityType.entity'],
        message: t(row['notificationObject.entityType.i18nAttribute'], {
          client: client ? client['agencyClient.client'] : '',
        }),
        createdAt: row['createdAt'],
        status: row['notificationObject.status'],
        new: row['status'],
        id: row['notificationId'],
      };
    });

    return out;
  }
}

module.exports = new NotificationRepository(Notification);
