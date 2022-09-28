const express = require('express');
const router = express.Router();

const { authenticate } = require('@middleware/auth');
const { account, marketplace, advProfile } = require('@middleware/access');
const { checkIfAllowedToSubmitChanges } = require('@middleware/advertising');

const {
  paginate,
  withSort,
  withDateRange,
} = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const campaignValidation = require('./campaign.validation');
const campaignController = require('./campaign.controller');
const campaignRecordController = require('./campaignRecord.controller');

router.get(
  '/',
  validate(campaignValidation.listCampaignsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withSort,
  withDateRange,
  campaignController.listCampaigns
);

router.put(
  '/:campaignId',
  validate(campaignValidation.updateCampaignRequest),
  authenticate(
    'ppc.campaign.updateDailyBudget.noApproval',
    'ppc.campaign.updateDailyBudget.requireApproval'
  ),
  account,
  marketplace,
  advProfile,
  checkIfAllowedToSubmitChanges,
  campaignController.updateCampaign
);

router.post(
  '/apply-recommended-budget',
  validate(campaignValidation.applyRecommendedBudgetRequest),
  authenticate(
    'ppc.campaign.applyRecommendedBudget.noApproval',
    'ppc.campaign.applyRecommendedBudget.requireApproval'
  ),
  account,
  marketplace,
  advProfile,
  checkIfAllowedToSubmitChanges,
  campaignController.applyRecommendedBudget
);

router.get(
  '/records',
  validate(campaignValidation.getCampaignRecordsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withDateRange,
  campaignRecordController.getCampaignRecords
);

router.get(
  '/weekly-records',
  validate(campaignValidation.getWeeklyCampaignRecordsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withDateRange,
  campaignRecordController.getWeeklyCampaignRecords
);

router.get(
  '/performance',
  validate(campaignValidation.getCampaignPerformanceRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withDateRange,
  campaignRecordController.getCampaignPerformance
);

module.exports = router;
