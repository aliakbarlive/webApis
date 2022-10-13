const crypto = require('crypto');
const axios = require('axios');
const asyncHandler = require('../../middleware/async');
const { AgencyClient, Subscription } = require('../../models');
const zohoSubscription = require('../../utils/zohoSubscription');

// @desc     Save AgencyClient to SI via webhook
// @route    POST /api/v1/agency/client/wh
// @access   Private
// @ref      https://stackoverflow.com/questions/36924021/hash-hmac-equivalent-in-node-js

exports.postAgencyClientToSI = asyncHandler(async (req, res, next) => {
  let { agencyClientId } = req.body;
  let key = process.env.SI_WEBHOOK_KEY;
  let client = await AgencyClient.findByPk(agencyClientId);

  const { subscriptionId } = await Subscription.findOne({
    where: { accountId: client.accountId },
  });

  const zoho = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `subscriptions/${subscriptionId}`,
  });

  const subscription = zoho.message == 'success' ? zoho.subscription : {};

  client.hostedpageDetails = {
    subscription_id: subscription.subscription_id,
    price: subscription.plan.price,
    first_name: subscription.customer.first_name,
    last_name: subscription.customer.last_name,
    email: subscription.customer.email,
    address1: subscription.customer.billing_address.street,
    address2: subscription.customer.billing_address.street2,
    city: subscription.customer.billing_address.city,
    state: subscription.customer.billing_address.state,
    zip: subscription.customer.billing_address.zip,
    country: subscription.customer.billing_address.country,
  };

  let hmac = crypto.createHmac('sha256', key);
  let signed = hmac.update(Buffer.from(JSON.stringify(client))).digest('hex');

  await axios({
    method: 'POST',
    url: `${process.env.SI_URL}/bs-wh`,
    data: client,
    headers: {
      Signature: signed,
    },
  });

  res.status(200).json({
    success: true,
  });
});
