const asyncHandler = require('@middleware/async');
const SocketInit = require('../../socket');
const {
  listNotifications,
  listEntityTypes,
  addEntityType,
  addNotification,
  markAsRead,
} = require('./notification.service');

// @desc     List notification entity types
// @route    GET /v1/notifications/entitytype
// @access   Private
exports.listNotificationEntityTypes = asyncHandler(async (req, res, next) => {
  const response = await listEntityTypes(req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
    y,
  });
});

// @desc     Add notification entity type
// @route    POST /v1/notifications/entitytype
// @access   Private
exports.addNotificationEntityType = asyncHandler(async (req, res, next) => {
  const { entity, i18nAttribute, description } = req.body;
  const response = await addEntityType({ entity, i18nAttribute, description });

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Add notification
// @route    POST /v1/notifications
// @access   Private
exports.addNotification = asyncHandler(async (req, res, next) => {
  const { entityTypeId, entityId, status, recipientIds } = req.body;
  const { userId } = req.user;

  const response = await addNotification({
    entityTypeId,
    entityId,
    status,
    creatorId: userId,
    recipientIds,
  });

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
  // const socket = SocketInit.get();
  // if (socket) {
  //   const socketUsers = socket.getConnectedUsers();

  //   recipientIds.map((recipientId) => {
  //     const recipientConnected = socketUsers.find(
  //       (u) => (u.userId = recipientId)
  //     );
  //     if (recipientConnected) {
  //       return socket.privateMessage(recipientConnected.socketId, 'notify', {
  //         refresh: 1,
  //       });
  //     }
  //   });
  //   res.status(200).json({ yes: 'ok' });
  //   //socket.emit('notify', { refresh: 1 });
  // }
});

// @desc     List notifications
// @route    GET /v1/notifications
// @access   Private
exports.listNotifications = asyncHandler(async (req, res, next) => {
  const response = await listNotifications({
    ...req.query,
    recipientId: req.user.userId,
    sort: ['notificationId', 'desc'],
  });

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

exports.markAsReadNotifications = asyncHandler(async (req, res, next) => {
  const { ids } = req.body;
  const response = await markAsRead(ids);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });

  // res.status(200).json({
  //   success: ids,
  // });
});
