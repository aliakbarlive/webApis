const express = require('express');

const {
  getSubscriptions,
  getSubscription,
  addSubscription,
  editSubscription,
  getLatestInvoice,
  newSubscriber,
  getRecentActivities,
  getScheduledChanges,
  updateCardDetails,
  dropScheduledChanges,
  getCommissions,
  changeAutoCollect,
  cancelSubscription,
  reactivateSubscription,
  deleteSubscription,
  addCharge,
  buyOneTimeAddon,
  extendBillingCycle,
  pauseSubscription,
  resumeSubscription,
  addOfflineSubscription,
  postponeRenewal,
  updateCustomField,
  addSubscriptionZohoClient,
  syncStatus,
  updatePlanDescription,
  addNote,
  getNotes,
  deleteNote,
  getPendingInvoices,
  getSubscriptionByAgencyClientId,
  getSubscriptionsByZohoId,
  syncData,
} = require('../../controllers/agency/subscriptions');

const { protect, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { zohoWebhook } = require('../../middleware/zohoWebhook');
const {
  updatePlanDescriptionRequest,
  noteRequest,
  updateSubscriptionRequest,
} = require('../../validations/subscription.validation');
const router = express.Router();

router.get('/', protect, getSubscriptions);
router.post('/', protect, addSubscription);
router.get('/client/:agencyClientId', protect, getSubscriptionByAgencyClientId);
router.get('/zoho-client/:zohoId', protect, getSubscriptionsByZohoId);
router.post('/old-client', protect, addSubscriptionZohoClient);
//router.post('/new', newSubscriber);
router.post('/syncstatus', zohoWebhook, syncStatus);
router.post('/offline', addOfflineSubscription);
router.get('/:subscriptionId', protect, getSubscription);
router.put(
  '/:subscriptionId',
  validate(updateSubscriptionRequest),
  protect,
  editSubscription
);
router.delete('/:subscriptionId', protect, deleteSubscription);
router.get('/:subscriptionId/commissions', protect, getCommissions);
router.get('/:subscriptionId/latestinvoice', protect, getLatestInvoice);
router.get('/:subscriptionId/recentactivities', protect, getRecentActivities);
router.get('/:subscriptionId/scheduledchanges', protect, getScheduledChanges);
router.delete(
  '/:subscriptionId/scheduledchanges',
  protect,
  dropScheduledChanges
);
router.post('/:subscriptionId/updatecard', protect, updateCardDetails);
router.post('/:subscriptionId/autocollect', protect, changeAutoCollect);
router.post('/:subscriptionId/cancel', protect, cancelSubscription);
router.post('/:subscriptionId/reactivate', protect, reactivateSubscription);
router.post('/:subscriptionId/addcharge', protect, addCharge);
router.post('/:subscriptionId/buyonetimeaddon', protect, buyOneTimeAddon);
router.post('/:subscriptionId/extend', protect, extendBillingCycle);
router.post('/:subscriptionId/pause', protect, pauseSubscription);
router.post('/:subscriptionId/resume', protect, resumeSubscription);
router.post('/:subscriptionId/postpone', protect, postponeRenewal);
router.post('/:subscriptionId/customfields', protect, updateCustomField);
router.post(
  '/:subscriptionId/lineitems/:planCode',
  validate(updatePlanDescriptionRequest),
  protect,
  updatePlanDescription
);
router.get('/:subscriptionId/notes', protect, getNotes);
router.post('/:subscriptionId/notes', validate(noteRequest), protect, addNote);
router.delete('/:subscriptionId/notes/:noteId', protect, deleteNote);
router.get('/:subscriptionId/pendinginvoices', protect, getPendingInvoices);
router.post('/:subscriptionId/sync', protect, syncData);

module.exports = router;
