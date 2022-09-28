const express = require('express');
const router = express.Router();

// * Middlewares
const { protect, account } = require('../../middleware/auth.js');
const validate = require('../../middleware/validate');

// *Validations
const subscriptionValidation = require('../../validations/subscription.validation');

// * Controllers
const subscriptionController = require('../../controllers/subscription.controller');

router.get('/', protect, subscriptionController.getSubscriptions);
router.post('/', protect, subscriptionController.createSubscription);
router.post(
  '/card/hosted-page/',
  subscriptionController.generateHostedPageForUpdateCard
);
router.get('/card-after-success', subscriptionController.updateCardSuccess);

module.exports = router;
