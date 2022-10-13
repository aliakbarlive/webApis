const Queue = require('bull');
const crypto = require('crypto');
const axios = require('axios');
const { AgencyClient } = require('../../models');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const queue = new Queue('SI - Save Webhook', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});

// Process
queue.process(async (job, done) => {
  const { accountId, subscription } = job.data;

  try {
    let key = process.env.SI_WEBHOOK_KEY;
    let client = await AgencyClient.findOne({
      where: { accountId },
    });

    client.hostedpageDetails = {
      subscription_id: subscription.subscription_id,
      price: subscription.plan.price,
      plan_description: subscription.plan.description,
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

    done();
  } catch (err) {
    console.log(err);
    done(new Error(err.message));
  }
});

queue.on('completed', async (job, result) => {
  console.log('Successfully saved to SI app');
});

queue.on('failed', function (job, result) {
  console.log('failed');
  console.log(result);
});

queue.on('progress', function (job, result) {
  console.log('progress');
});

queue.on('error', function (err) {
  console.log('error');
  console.log(err);
});

queue.on('active', function (job, err) {
  console.log('SI - Save Webhook active');
});

module.exports = queue;
