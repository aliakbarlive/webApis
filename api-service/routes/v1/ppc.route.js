const express = require('express');
const router = express.Router();

const { campaignRoute } = require('@features/advertising/campaign');
const { changeRequestRoute } = require('@features/advertising/changeRequest');
const { optimizationRoute } = require('@features/advertising/optimization');
const { analyticsRoute } = require('@features/advertising/analytics');

const validate = require('../../middleware/validate');

// Middlewares
const { authenticate } = require('../../middleware/auth.js');
const { account, marketplace, advProfile } = require('../../middleware/access');
const {
  paginate,
  withFilters,
  withSort,
  withDateRange,
} = require('../../middleware/advancedList');

// Controllers
const { exportData } = require('../../controllers/client/advertising');

const {
  getCampaignList,
  getCampaignRecords,
  getCampaignDetails,
  getAllCampaignRecords,
  getCampaignStatistics,
  getAllCampaignStatistics,
} = require('../../controllers/client/advCampaign');

const {
  getAdGroupList,
  getAdvAdGroupRecords,
  getAdvAdGroupDetails,
  getAdvAdGroupStatistics,
} = require('../../controllers/client/advAdGroup');

const {
  getAdvRuleList,
  createAdvRule,
  getAdvRule,
  updateAdvRule,
} = require('../../controllers/client/advRule');

const { getAdvPortfolioList } = require('../../controllers/client/advPorfolio');

const {
  getAdvChangeCollectionList,
} = require('../../controllers/client/advChangeCollection');

// Validations
const {
  getAdvCampaignsRequest,
  getAdvCampaignRecordsRequest,
  getAdvCampaignDetailsRequest,
  getAdvCampaignStatisticsRequest,
  getAllAdvCampaignRecordsRequest,
  getAllAdvCampaignStatisticsRequest,
} = require('../../validations/advCampaign.validation');

const {
  getAdvAdGroupsRequest,
  getAdGroupDetailsRequest,
  getAdGroupRecordsRequest,
  getAdGroupStatisticsRequest,
} = require('../../validations/advAdGroup.validation');

const {
  exportDataRequest,
} = require('../../validations/advertising.validation');

const {
  getAdvRuleListRequest,
  getAdvRuleRequest,
  createAdvRuleRequest,
  updateAdvRuleRequest,
} = require('../../validations/advRule.validation');

const {
  getAdvRuleActionListRequest,
} = require('../../validations/advRuleAction.validation');

const {
  getAdvRuleActionList,
} = require('../../controllers/client/advRuleAction');

const {
  getAdvPortfoliosRequest,
} = require('../../validations/advPorfolio.validation');

const {
  getAdvChangeCollectionListRequest,
} = require('../../validations/advChangeCollection.validation');

router.get(
  '/export',
  validate(exportDataRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withFilters,
  withSort,
  withDateRange,
  exportData
);

// Campaigns
router.get(
  '/campaigns',
  validate(getAdvCampaignsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withFilters,
  withSort,
  withDateRange,
  getCampaignList
);

router.get(
  '/campaigns/records',
  validate(getAllAdvCampaignRecordsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withFilters,
  withDateRange,
  getAllCampaignRecords
);

router.get(
  '/campaigns/statistics',
  validate(getAllAdvCampaignStatisticsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withFilters,
  withDateRange,
  getAllCampaignStatistics
);

router.get(
  '/campaigns/:advCampaignId',
  validate(getAdvCampaignDetailsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  getCampaignDetails
);

router.get(
  '/campaigns/:advCampaignId/statistics',
  validate(getAdvCampaignStatisticsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withFilters,
  withDateRange,
  getCampaignStatistics
);

router.get(
  '/campaigns/:advCampaignId/records',
  validate(getAdvCampaignRecordsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withFilters,
  withDateRange,
  getCampaignRecords
);

// Ad Groups
router.get(
  '/ad-groups',
  validate(getAdvAdGroupsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withFilters,
  withSort,
  withDateRange,
  getAdGroupList
);

router.get(
  '/ad-groups/:advAdGroupId',
  validate(getAdGroupDetailsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  getAdvAdGroupDetails
);

router.get(
  '/ad-groups/:advAdGroupId/statistics',
  validate(getAdGroupStatisticsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withDateRange,
  getAdvAdGroupStatistics
);

router.get(
  '/ad-groups/:advAdGroupId/records',
  validate(getAdGroupRecordsRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  withDateRange,
  getAdvAdGroupRecords
);

router.get(
  '/portfolios',
  validate(getAdvPortfoliosRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withFilters,
  withSort,
  getAdvPortfolioList
);

router.get(
  '/rules/actions',
  validate(getAdvRuleActionListRequest),
  authenticate('ppc.rule.list', 'ppc.rule.create', 'ppc.rule.edit'),
  paginate,
  withFilters,
  withSort,
  getAdvRuleActionList
);

router.get(
  '/rules',
  validate(getAdvRuleListRequest),
  authenticate(
    'ppc.rule.list',
    'ppc.optimization.noApproval',
    'ppc.optimization.requireApproval'
  ),
  account,
  marketplace,
  paginate,
  withFilters,
  withSort,
  getAdvRuleList
);

router.get(
  '/rules/:advRuleId',
  validate(getAdvRuleRequest),
  authenticate(
    'ppc.rule.list',
    'ppc.optimization.noApproval',
    'ppc.optimization.requireApproval'
  ),
  account,
  marketplace,
  getAdvRule
);

router.post(
  '/rules',
  validate(createAdvRuleRequest),
  authenticate('ppc.rule.create'),
  account,
  marketplace,
  createAdvRule
);

router.put(
  '/rules/:advRuleId',
  validate(updateAdvRuleRequest),
  authenticate('ppc.rule.update'),
  account,
  marketplace,
  updateAdvRule
);

router.get(
  '/change-collections',
  validate(getAdvChangeCollectionListRequest),
  authenticate('ppc.view'),
  account,
  marketplace,
  advProfile,
  paginate,
  withFilters,
  withSort,
  getAdvChangeCollectionList
);

router.use('/campaigns', campaignRoute);
router.use('/change-requests', changeRequestRoute);
router.use('/optimizations', optimizationRoute);
router.use('/analytics', analyticsRoute);

module.exports = router;
