const express = require('express');
const router = express.Router();

const { deleteRedis } = require('../../controllers/redis');

const { protect } = require('../../middleware/auth.js');

router.delete('/', protect, deleteRedis);

module.exports = router;
