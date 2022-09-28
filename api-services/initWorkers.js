module.exports = () => {
  // Adv. Snapshots.
  require('./queues/advSnapshots/cron');
  require('./queues/advSnapshots/request');
  require('./queues/advSnapshots/generate');
  require('./queues/advSnapshots/save');

  // Adv. Performance.
  require('./queues/advPerformanceReport/cron');
  require('./queues/advPerformanceReport/request');
  require('./queues/advPerformanceReport/generate');
  require('./queues/advPerformanceReport/save');

  // Financial Events
  require('./queues/financialEvents/cron');
  require('./queues/financialEvents/save');
  require('./queues/financialEvents/request');

  // Inbound FBA Shipments
  require('./queues/inboundFBAShipments/cron');
  require('./queues/inboundFBAShipments/request');
  require('./queues/inboundFBAShipments/save');

  // Inbound FBA Shipment Items
  require('./queues/inboundFBAShipmentItems/cron');
  require('./queues/inboundFBAShipmentItems/request');
  require('./queues/inboundFBAShipmentItems/save');

  // Inventory
  require('./queues/inventory/cron');
  require('./queues/inventory/request');
  require('./queues/inventory/save');

  // Keywords
  require('./queues/keywords/request');

  // Orders
  require('./queues/orders/cron');
  require('./queues/orders/update');
  require('./queues/orders/generate');
  require('./queues/orders/request');
  require('./queues/orders/save');

  // Products
  require('./queues/products/request');
  require('./queues/products/cron');
  require('./queues/products/save');

  // Reviews
  require('./queues/reviews/request');
  require('./queues/reviews/cron');
  require('./queues/reviews/save');

  // Subscriptions
  require('./queues/subscription/saveNewSubscription');
  require('./queues/subscription/saveToSiViaWebhook');

  // Invoices
  require('./queues/invoices/commission/compute');
  require('./queues/invoices/commission/cron');
  require('./queues/invoices/email/send');
  require('./queues/invoices/email/cron');
  require('./queues/invoices/collect/charge');
  require('./queues/invoices/collect/cron');

  // SES
  require('./queues/ses/sendEmail');
  require('./queues/ses/sendRawEmail');

  return console.log('Bull workers initialized');
};
