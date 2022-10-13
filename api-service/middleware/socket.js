const asyncHandler = require('./async');
const userService = require('../services/user.service');

exports.socketAuth = asyncHandler(async (socket, next) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    return next(new Error('invalid user id'));
  }

  const user = await userService.getUser({ userId });
  if (!user) {
    return next(new Error('User not found'));
  }

  socket.userId = userId;
  socket.user = user;
  next();
});
