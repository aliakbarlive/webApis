const express = require('express');
const accountRoute = require('./account.route');
const alertRoute = require('./alert.route');
const authRoute = require('./auth.route');
const inboundFBAShipmentRoute = require('./inboundFBAShipment.route');
const inventoryRoute = require('./inventory.route');
const keywordRoute = require('./keyword.route');
const categoryRoute = require('./category.route');
const listingRoute = require('./listing.route');
const noteRoute = require('./note.route');
const orderRoute = require('./order.route');
const postgresRoute = require('./postgres.route');
const ppcRoute = require('./ppc.route');
const productsRoute = require('./products.route');
const profitRoute = require('./profit.route');
const ratingsRoute = require('./ratings.route');
const redisRoute = require('./redis.route');
const reviewsRoute = require('./reviews.route');
const tagRoute = require('./tag.route');
const userRoute = require('./user.route');
const inviteRoute = require('./invite.route');
const subscriptionRoute = require('./subscription.route');
const clientMigrationRoute = require('./clientMigration.route');
const s3Route = require('./s3.route');
const advertisingRoute = require('@features/advertising/advertising.route');
const dataSyncRoute = require('@features/dataSync/dataSync.route');
const notificationRoute = require('@features/notification/notification.route');

const router = express.Router();

const routes = [
  {
    path: '/accounts',
    route: accountRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
  {
    path: '/advertising',
    route: advertisingRoute,
  },
  {
    path: '/data-sync',
    route: dataSyncRoute,
  },
  {
    path: '/alerts',
    route: alertRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/inbound-fba-shipments',
    route: inboundFBAShipmentRoute,
  },
  {
    path: '/inventory',
    route: inventoryRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/keywords',
    route: keywordRoute,
  },
  {
    path: '/listings',
    route: listingRoute,
  },
  {
    path: '/notes',
    route: noteRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/postgres',
    route: postgresRoute,
  },
  {
    path: '/ppc',
    route: ppcRoute,
  },
  {
    path: '/products',
    route: productsRoute,
  },
  {
    path: '/profit',
    route: profitRoute,
  },
  {
    path: '/ratings',
    route: ratingsRoute,
  },
  {
    path: '/redis',
    route: redisRoute,
  },
  {
    path: '/reviews',
    route: reviewsRoute,
  },
  {
    path: '/subscriptions',
    route: subscriptionRoute,
  },
  {
    path: '/tags',
    route: tagRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/invites',
    route: inviteRoute,
  },
  {
    path: '/client-migration',
    route: clientMigrationRoute,
  },
  {
    path: '/s3',
    route: s3Route,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
