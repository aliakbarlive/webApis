const Redis = require('ioredis');

const cache = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
});

module.exports = cache;
