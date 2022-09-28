'use strict';
const Queue = require('bull');
const dotenv = require('dotenv');

dotenv.config({ path: 'config/config.env' });

const updateKeywordBid = require('./updateKeywordBid');
const updateKeywordStatus = require('./updateKeywordStatus');
const updateCampaignStatus = require('./updateCampaignStatus');
const createNegativeKeyword = require('./createNegativeKeyword');
const updateCampaignDailyBudget = require('./updateCampaignDailyBudget');
const createCampaignNegativeKeyword = require('./createCampaignNegativeKeyword');
const createNewKeywordToNewCampaign = require('./createNewKeywordToNewCampaign');
const createNewKeywordToExistingAdGroup = require('./createNewKeywordToExistingAdGroup');

let queue = Queue('Adv. Optimization', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});

queue.process('SP:CAMPAIGNS:UPDATE_STATUS', 1, updateCampaignStatus);
queue.process('SP:CAMPAIGNS:UPDATE_DAILY_BUDGET', 1, updateCampaignDailyBudget);

queue.process('SP:KEYWORDS:UPDATE_STATUS', 1, updateKeywordStatus);
queue.process('SP:KEYWORDS:UPDATE_BID', 1, updateKeywordBid);

queue.process(
  'SP:SEARCH_TERMS:CONVERT_AS_NEGATIVE_KEYWORD',
  1,
  createNegativeKeyword
);

queue.process(
  'SP:SEARCH_TERMS:CONVERT_AS_CAMPAIGN_NEGATIVE_KEYWORD',
  1,
  createCampaignNegativeKeyword
);

queue.process(
  'SP:SEARCH_TERMS:CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP',
  1,
  createNewKeywordToExistingAdGroup
);

queue.process(
  'SP:SEARCH_TERMS:CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP',
  1,
  createNewKeywordToNewCampaign
);

queue.on('failed', function (job, result) {
  console.log(result);
});

queue.on('error', function (err) {
  console.log(err);
});

module.exports = queue;
