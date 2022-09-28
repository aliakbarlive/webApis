const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth.js');
const { identifiable } = require('../../middleware/advancedList');

const { createUserAccount } = require('../../controllers/userAccount');

router.post('/:userId/accounts', protect, identifiable, createUserAccount);

module.exports = router;
