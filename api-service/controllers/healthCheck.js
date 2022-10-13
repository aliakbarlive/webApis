const asyncHandler = require('../middleware/async');
const SocketInit = require('../socket');

// @desc     Server Health Check
// @route    GET /api/healthcheck
// @access   Private
exports.healthCheck = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: 'Server is running healthy.',
  });
});

exports.socketTest = asyncHandler(async (req, res, next) => {
  const socket = SocketInit.get();
  if (socket) {
    socket.emit('hello', { hello: 'world!' });
    res.status(200).json({
      success: true,
      data: 'Socket connected.',
    });
  } else {
    res.status(400).json({
      success: false,
      data: `Can't connect to Socket`,
    });
  }
});

exports.getSocketConnectedUsers = asyncHandler(async (req, res, next) => {
  const socket = SocketInit.get();

  if (socket) {
    const socketUsers = socket.getConnectedUsers();

    res.status(200).json({
      success: true,
      data: socketUsers,
    });
  } else {
    res.status(400).json({
      success: false,
      data: `Can't connect to Socket`,
    });
  }
});
