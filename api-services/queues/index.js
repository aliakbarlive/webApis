// Adv. Performance Reports
const advPerformanceReportCron = require('./advPerformanceReport/cron');
const advPerformanceReportGenerate = require('./advPerformanceReport/generate');
const advPerformanceReportSave = require('./advPerformanceReport/save');
const advPerformanceReportRequest = require('./advPerformanceReport/request');
const advPerformanceReportInitCron = require('./advPerformanceReport/initCron');

// Adv. Snapshots
const advSnapshotCron = require('./advSnapshots/cron');
const advSnapshotRequest = require('./advSnapshots/request');
const advSnapshotSave = require('./advSnapshots/save');
const advSnapshotGenerate = require('./advSnapshots/generate');
const advSnapshotInitCron = require('./advSnapshots/initCron');
const advSnapshotSaveHistory = require('./advSnapshots/saveHistory');

const syncTargeting = require('./advertising/sync/syncTargeting');
const syncProfileTargeting = require('./advertising/sync/syncProfileTargeting');

// Financial Events
const financialEventCron = require('./financialEvents/cron');
const financialEventRequest = require('./financialEvents/request');
const financialEventSave = require('./financialEvents/save');

// Inbound FBA Shipments

const inboundFBAShipmentCron = require('./inboundFBAShipments/cron');
const inboundFBAShipmentRequest = require('./inboundFBAShipments/request');
const inboundFBAShipmentSave = require('./inboundFBAShipments/save');

// Inbound FBA Shipment Items
const inboundFBAShipmentItemCron = require('./inboundFBAShipmentItems/cron');
const inboundFBAShipmentItemRequest = require('./inboundFBAShipmentItems/request');
const inboundFBAShipmentItemSave = require('./inboundFBAShipmentItems/save');

// Inventory
const inventoryCron = require('./inventory/cron');
const inventoryRequest = require('./inventory/request');
const inventorySave = require('./inventory/save');

// Keywords
const keywordRequest = require('./keywords/request');

// Notifications
const emailNotifications = require('./notifications/queue');

// Orders
const orderCron = require('./orders/cron');
const orderUpdate = require('./orders/update');
const orderGenerate = require('./orders/generate');
const orderRequest = require('./orders/request');
const orderSave = require('./orders/save');

// Products
const productCron = require('./products/cron');
const productRequest = require('./products/request');
const productSave = require('./products/save');

// Reviews
const reviewCron = require('./reviews/cron');
const reviewRequest = require('./reviews/request');
const reviewSave = require('./reviews/save');

// SES
const sendEmail = require('./ses/sendEmail');
const sendRawEmail = require('./ses/sendRawEmail');

// Subscription
//const subscriptionSave = require('./subscription/saveNewSubscription');
const subscriptionSaveToSI = require('./subscription/saveToSiViaWebhook');
const subscriptionSync = require('./subscription/syncStatus');
const subscriptionSyncCron = require('./subscription/syncSubscriptionsCron');

// Invoice
const invoicesCommission = require('./invoices/commission/compute');
const invoicesCommissionCron = require('./invoices/commission/cron');
const invoicesEmail = require('./invoices/email/send');
const invoicesEmailCron = require('./invoices/email/cron');
const invoicesCollect = require('./invoices/collect/charge');
const invoicesCollectCron = require('./invoices/collect/cron');
const invoicesCommissionErrorNotify = require('./invoices/commission/notify');
const invoicesSync = require('./invoices/sync/cron');
const invoicesDetailsSync = require('./invoices/sync/syncInvoice');
const invoicesDetailsCronSync = require('./invoices/sync/syncInvoicesCron');

const proceedOptimizationQueue = require('./advOptimizations/proceed');

// Adv Campaign Recommended Budget
const advCampaignRecommendedBudgetCron = require('./advCampaignRecommendedBudget/cron');
const advCampaignRecommendedBudgetSave = require('./advCampaignRecommendedBudget/save');

const advGenerateReport = require('./advertising/report/generate');
const accountMarketplaceSync = require('./account/syncMarketplace');

const computeCommissionCron = require('./compute/cron');

const queues = [
  advPerformanceReportCron,
  advPerformanceReportGenerate,
  advPerformanceReportSave,
  advPerformanceReportRequest,
  advPerformanceReportInitCron,
  advSnapshotInitCron,
  advSnapshotCron,
  advSnapshotRequest,
  advSnapshotGenerate,
  advSnapshotSave,
  advSnapshotSaveHistory,
  syncTargeting,
  syncProfileTargeting,
  financialEventCron,
  financialEventRequest,
  financialEventSave,
  inboundFBAShipmentCron,
  inboundFBAShipmentRequest,
  inboundFBAShipmentSave,
  inboundFBAShipmentItemCron,
  inboundFBAShipmentItemRequest,
  inboundFBAShipmentItemSave,
  inventoryCron,
  inventoryRequest,
  inventorySave,
  keywordRequest,
  emailNotifications,
  orderCron,
  orderUpdate,
  orderGenerate,
  orderRequest,
  orderSave,
  productCron,
  productRequest,
  productSave,
  reviewCron,
  reviewRequest,
  reviewSave,
  sendEmail,
  sendRawEmail,
  //subscriptionSave,
  subscriptionSaveToSI,
  subscriptionSync,
  subscriptionSyncCron,
  invoicesSync,
  invoicesDetailsSync,
  invoicesDetailsCronSync,
  invoicesCommission,
  invoicesCommissionCron,
  invoicesEmail,
  invoicesEmailCron,
  invoicesCollect,
  invoicesCollectCron,
  invoicesCommissionErrorNotify,
  proceedOptimizationQueue,
  advCampaignRecommendedBudgetCron,
  advCampaignRecommendedBudgetSave,
  advGenerateReport,
  accountMarketplaceSync,
  computeCommissionCron,
];

const initWorkers = () => {
  queues.forEach((queue) => queue);
};

module.exports = { queues, initWorkers };
