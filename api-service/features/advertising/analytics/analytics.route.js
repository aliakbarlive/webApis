const express = require('express');
const router = express.Router();

const { protect } = require('@middleware/auth');
const { account, marketplace, advProfile } = require('@middleware/access');

const validate = require('@middleware/validate');
const {
  paginate,
  withFilters,
  withDateRange,
} = require('@middleware/advancedList');

const analyticsValidation = require('./analytics.validation');
const analyticsController = require('./analytics.controller');

router.get(
  '/funnel',
  validate(analyticsValidation.getFunnel),
  protect,
  account,
  marketplace,
  advProfile,
  withDateRange,
  analyticsController.getFunnel
);

router.get(
  '/keywords/distribution',
  validate(analyticsValidation.getKeywordsDistribution),
  protect,
  account,
  marketplace,
  advProfile,
  withDateRange,
  analyticsController.getKeywordsDistribution
);

router.get(
  '/overall',
  validate(analyticsValidation.getOverallPerformance),
  protect,
  account,
  marketplace,
  advProfile,
  withDateRange,
  analyticsController.getOverallPerformance
);

router.get(
  '/performance',
  validate(analyticsValidation.getProfilePerformance),
  protect,
  account,
  marketplace,
  advProfile,
  withDateRange,
  analyticsController.getProfilePerformance
);

router.get(
  '/campaign-types/summary',
  validate(analyticsValidation.getCampaignTypesSummary),
  protect,
  account,
  marketplace,
  advProfile,
  withDateRange,
  analyticsController.getCampaignTypesSummary
);

router.get(
  '/campaign-types/performance',
  validate(analyticsValidation.getCampaignTypesPerformance),
  protect,
  account,
  marketplace,
  advProfile,
  withDateRange,
  analyticsController.getCampaignTypesPerformance
);

router.get(
  '/targeting-types/performance',
  validate(analyticsValidation.getTargetingTypesPerformance),
  protect,
  account,
  marketplace,
  advProfile,
  withDateRange,
  analyticsController.getTargetingTypesPerformance
);

router.get(
  '/campaign-changes',
  validate(analyticsValidation.getChangesByCampaigns),
  protect,
  account,
  marketplace,
  advProfile,
  paginate,
  withDateRange,
  analyticsController.getChangesByCampaigns
);

router.get(
  '/product-changes',
  validate(analyticsValidation.getChangesByProducts),
  protect,
  account,
  marketplace,
  advProfile,
  paginate,
  withDateRange,
  analyticsController.getChangesByProducts
);

router.get(
  '/keyword-changes',
  validate(analyticsValidation.getChangesByKeywords),
  protect,
  account,
  marketplace,
  advProfile,
  paginate,
  withFilters,
  withDateRange,
  analyticsController.getChangesByKeywords
);

router.get(
  '/keyword-converters-summary',
  validate(analyticsValidation.getKeywordConvertersSummary),
  protect,
  account,
  marketplace,
  advProfile,
  withDateRange,
  analyticsController.getKeywordConvertersSummary
);

router.get(
  '/:granularity',
  validate(analyticsValidation.getPerformanceByGranularity),
  protect,
  account,
  marketplace,
  advProfile,
  withDateRange,
  analyticsController.getPerformanceByGranularity
);

module.exports = router;
