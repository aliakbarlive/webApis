const express = require('express');

const router = express.Router();

const validate = require('../../middleware/validate');

const {
  paginate,
  identifiable,
  withFilters,
  withSort,
} = require('../../middleware/advancedList');

const { protect } = require('../../middleware/auth.js');
const { account, marketplace } = require('../../middleware/access');

const {
  getListingAlertConfigs,
  updateListingAlertConfig,
  getListingAlertConfigsSummary,
} = require('../../controllers/client/listingAlertConfigurations');

const {
  getListingAlertConfigsRequest,
  updateListingAlertConfigRequest,
  getListingAlertConfigsSummaryRequest,
} = require('../../validations/listing.validation');

router.get(
  '/alert-configs/summary',
  validate(getListingAlertConfigsSummaryRequest),
  protect,
  account,
  marketplace,
  getListingAlertConfigsSummary
);

router.get(
  '/alert-configs',
  validate(getListingAlertConfigsRequest),
  protect,
  account,
  marketplace,
  paginate,
  withFilters,
  withSort,
  getListingAlertConfigs
);

router.put(
  '/alert-configs/:listingAlertConfigurationId',
  validate(updateListingAlertConfigRequest),
  protect,
  account,
  marketplace,
  identifiable,
  updateListingAlertConfig
);

module.exports = router;
