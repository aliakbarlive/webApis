const asyncHandler = require('../middleware/async');
const Redis = require('ioredis');

// @desc     Flush redis node
// @route    DELETE /api/v1/redis
// @access   PRIVATE
exports.deleteRedis = asyncHandler(async (req, res, next) => {
  const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  });
  await redis.flushall();

  res.status(200).json({
    success: true,
    code: 200,
    data: 'Successfuly flushed Redis.',
  });
});
