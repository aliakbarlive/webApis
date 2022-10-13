const express = require('express');
const router = express.Router();

const { deletePostgres } = require('../../controllers/postgres');

const { protect } = require('../../middleware/auth.js');

router.delete('/', protect, deletePostgres);

module.exports = router;
