const express = require('express');
const { protect } = require('../../middleware/auth');
const router = express.Router();

const { getMarketplaces } = require('../../controllers/agency/marketplaces');

router.get('/', protect, getMarketplaces);

module.exports = router;
