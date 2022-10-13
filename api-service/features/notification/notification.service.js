const { Op } = require('sequelize');
const { AgencyClient, Account, Subscription } = require('@models');
const Response = require('@utils/response');

const notificationRepo = require('./notification.repository');
const entityTypeRepo = require('./notificationEntityType.repository');
const notificationChangeRepository = require('./notificationChange.repository');
const notificationObjectRepository = require('./notificationObject.repository');
const { groupBy } = require('lodash');
const { t } = require('i18next');
const {
  NOTIFICATION_ENTITY_TYPE,
  ENTITY_TYPE_NOTIFIERS,
} = require('./utils/constants');
const { getRoleIds } = require('../../services/role.service');
const { getUsersByRoleId } = require('../../services/user.service');
const SocketInit = require('../../socket');

const listEntityTypes = async (options) => {
  let data = await entityTypeRepo.findAndCountAll(options);

  return new Response()
    .withData(data)
    .withMessage('Entity Types successfully fetched.');
};

const addEntityType = async (payload) => {
  let data = await entityTypeRepo.create(payload);

  return new Response().withData(data).withMessage('Entity Type created');
};

const listNotifications = async (options) => {
  let { rows, count } = await notificationRepo.findAndCountAll(options);
  let grouped = groupBy(rows, 'notificationObject.entityType.entity');
  const objKeys = Object.keys(grouped);

  let messages = [];
  await Promise.all(
    objKeys.map(async (o) => {
      let rows = null;
      switch (o) {
        case 'clients':
          rows = await notificationRepo.getClientsMessages(grouped[o]);
          break;
        case 'terminations':
          rows = await notificationRepo.getTerminationMessages(grouped[o]);
          break;
        default:
          rows = null;
          break;
      }

      if (rows) {
        messages.push(...rows);
      }
    })
  );

  const collator = new Intl.Collator('en', {
    numeric: true,
    sensitivity: 'base',
  });

  messages.sort((a, b) => {
    return collator.compare(b.notificationObjectId, a.notificationObjectId);
  });

  return new Response()
    .withData({ messages, count })
    .withMessage('Notifications successfully fetched.');
};

const addNotification = async ({
  entityTypeId,
  entityId,
  status,
  creatorId,
  recipientIds,
}) => {
  const data = await notificationObjectRepository.createWithAssociations({
    entityTypeId,
    entityId,
    status,
  });

  await notificationChangeRepository.create({
    notificationObjectId: data.notificationObjectId,
    creatorId,
    status: 1,
  });

  if (recipientIds) {
    recipientIds.map(async (recipientId) => {
      return await notificationRepo.create({
        notificationObjectId: data.notificationObjectId,
        recipientId,
        status: 1,
      });
    });
  } else {
    let roles;
    switch (entityTypeId) {
      case NOTIFICATION_ENTITY_TYPE.clientSubscription:
        roles = ENTITY_TYPE_NOTIFIERS.clientSubscription;
        break;

      default:
        break;
    }

    const roleIds = await getRoleIds(roles);
    const notifiers = await getUsersByRoleId(roleIds);

    notifiers.map(async (userId) => {
      return await notificationRepo.create({
        notificationObjectId: data.notificationObjectId,
        recipientId: userId,
        status: 0,
      });
    });
  }

  const socket = SocketInit.get();
  if (socket && recipientIds) {
    recipientIds.map((recipientId) => {
      return socket.privateMessage(recipientId, 'notify', {
        refresh: 1,
      });
    });
  }

  return new Response().withData(data).withMessage('Notification added.');
};

const markAsRead = async (ids) => {
  const output = notificationRepo.update(
    { status: 0 },
    { where: { notificationId: { [Op.in]: ids } } }
  );

  return new Response().withData(output).withMessage('updated notifications.');
};

module.exports = {
  listNotifications,
  markAsRead,
  addNotification,
  listEntityTypes,
  addEntityType,
};
