const asyncHandler = require('../middleware/async');
const zohoSubscription = require('../utils/zohoSubscription');
const { Subscription } = require('../models');

// @desc     Get Subscription Details via accountId
// @route    GET /api/v1/account/{accountId}/subscription/
// @access   Private
exports.getSubscription = asyncHandler(async (req, res, next) => {
  const { accountId } = req.params;

  const { subscriptionId } = await Subscription.findOne({
    where: { accountId },
  });

  const zoho = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `subscriptions/${subscriptionId}`,
  });

  const subscription = zoho.message == 'success' ? zoho.subscription : {};

  const scheduledChanges = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `subscriptions/${subscriptionId}/scheduledchanges`,
  });

  res.status(200).json({
    success: true,
    subscription,
    scheduledChanges,
  });
});
