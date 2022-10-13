const express = require('express');
const router = express.Router();

// Middlewares
const { protect } = require('../../middleware/auth.js');
const { paginate, withSort } = require('../../middleware/advancedList');
const validate = require('../../middleware/validate');

// Validations
const {
  updateAccountRequest,
  updateAccountMarketplaceRequest,
  getAccountMembersRequest,
} = require('../../validations/account');

// Controllers
const {
  getAccounts,
  getAccount,
  updateAccount,
  updateAccountMarketplace,
  getAccountHostedPageDetails,
  getAccountSubscription,
  getAccountMembers,
  getAccountInitialSyncStatus,
} = require('../../controllers/account');

const { getSubscription } = require('../../controllers/subscription.js');
const { getInvoices, getInvoice } = require('../../controllers/invoices.js');

router.get('/', protect, paginate, withSort, getAccounts);

router.get('/:accountId', protect, getAccount);

router.put(
  '/:accountId',
  protect,
  validate(updateAccountRequest),
  updateAccount
);

router.get(
  '/:accountId/members',
  validate(getAccountMembersRequest),
  protect,
  paginate,
  withSort,
  getAccountMembers
);

router.get(
  '/:accountId/initial-sync-status',
  protect,
  getAccountInitialSyncStatus
);

router.put(
  '/:accountId/marketplaces/:marketplaceId',
  protect,
  validate(updateAccountMarketplaceRequest),
  updateAccountMarketplace
);

router.get('/:accountId/subscription', protect, getSubscription);
router.get('/:accountId/invoices', protect, paginate, getInvoices);
router.get('/:accountId/invoices/:invoiceId', protect, getInvoice);
router.get('/:accountId/hosted-page', protect, getAccountHostedPageDetails);
router.get('/:accountId/subscription', protect, getAccountSubscription);

module.exports = router;
