const express = require('express');
const router = express.Router();

const { profileRoute } = require('./profile');
const { reportRoute } = require('./report');
const { historyRoute } = require('./history');
const { analyticsRoute } = require('./analytics');
const { campaignRoute } = require('./campaign');
const { adGroupRoute } = require('./adGroup');
const { keywordRoute } = require('./keyword');
const { targetRoute } = require('./target');
const { targetingRoute } = require('./targeting');
const { productAdRoute } = require('./productAd');
const { searchTermRoute } = require('./searchTerm');
const { negativeTargetRoute } = require('./negativeTarget');
const { negativeKeywordRoute } = require('./negativeKeyword');
const { campaignNegativeKeywordRoute } = require('./campaignNegativeKeyword');

router.use('/profiles', profileRoute);
router.use('/reports', reportRoute);
router.use('/history', historyRoute);
router.use('/analytics', analyticsRoute);
router.use('/campaigns', campaignRoute);
router.use('/ad-groups', adGroupRoute);
router.use('/targets', targetRoute);
router.use('/keywords', keywordRoute);
router.use('/targetings', targetingRoute);
router.use('/product-ads', productAdRoute);
router.use('/search-terms', searchTermRoute);
router.use('/negative-targets', negativeTargetRoute);
router.use('/negative-keywords', negativeKeywordRoute);
router.use('/campaign-negative-keywords', campaignNegativeKeywordRoute);

module.exports = router;
