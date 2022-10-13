const express = require('express');

const {
  refreshToken,
  list,
  addPriceBook,
  getExchangeRates,
  getCurrency,
  addCurrency,
  getHostedPage,
  getWebhooks,
  getWebhook,
  addAddon,
  getEvents,
  getEvent,
  getPayments,
  getPayment,
  getAddons,
  getHostedPages,
} = require('../../controllers/agency/invoicing');

const { protect, authorize } = require('../../middleware/auth');
const router = express.Router();

router.post('/refreshToken', protect, refreshToken);
router.get('/list', protect, list);
router.get('/hostedpages', protect, getHostedPages);
router.get('/hostedpage/:id', protect, getHostedPage);
router.get('/currency', protect, getCurrency);
router.post('/currency', protect, addCurrency);
router.post('/currency/pricebooks', protect, addPriceBook);
router.get('/currency/exchangerates', protect, getExchangeRates);
router.get('/webhooks', protect, getWebhooks);
router.get('/webhooks/:id', protect, getWebhook);
router.post('/addon', protect, addAddon);
router.get('/events', protect, getEvents);
router.get('/events/:id', protect, getEvent);
router.get('/payments', protect, getPayments);
router.get('/payments/:id', protect, getPayment);
router.get('/addons', protect, getAddons);

module.exports = router;
