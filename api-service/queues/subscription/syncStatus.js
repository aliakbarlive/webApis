const Queue = require('bull');
//const { Subscription, AgencyClient } = require('../../models');
const {
  updateSubscription,
  getSubscription,
} = require('../../services/subscription.service');

const queue = new Queue('Subscriptions - Webhook', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  defaultJobOptions: {
    removeOnComplete: 300,
  },
  limiter: {
    max: 10,
    duration: 60000,
  },
});

// Process
queue.process(async (job, done) => {
  const { loaded } = job.data;
  let { subscription } = job.data;

  try {
    if (!loaded) {
      const output = await getSubscription(subscription.subscriptionId);
      subscription = output;
    }

    const { subscription_id: subscriptionId, status } = subscription;
    let data = {
      status,
      isOffline: subscription.card ? false : true,
      planName: subscription.plan
        ? subscription.plan.name
        : subscription.plan_name ?? '',
      planCode: subscription.plan
        ? subscription.plan.plan_code
        : subscription.plan_code ?? '',
      name: subscription.name,
      subscriptionNumber: subscription.subscription_number,
      amount: subscription.amount,
      subTotal: subscription.sub_total,
      isMeteredBilling: subscription.is_metered_billing,
      zohoId: subscription.customer_id,
      activatedAt: subscription.activated_at,
      currentTermStartsAt:
        subscription.current_term_starts_at === ''
          ? null
          : subscription.current_term_starts_at,
      currentTermEndsAt:
        subscription.current_term_ends_at === ''
          ? null
          : subscription.current_term_ends_at,
      lastBillingAt:
        subscription.last_billing_at === ''
          ? null
          : subscription.last_billing_at,
      nextBillingAt:
        subscription.next_billing_at === ''
          ? null
          : subscription.next_billing_at,
      expiresAt:
        subscription.expires_at === '' ? null : subscription.expires_at,
      pauseDate:
        subscription.pause_date === '' ? null : subscription.pause_date,
      resumeDate:
        subscription.resume_date === '' ? null : subscription.resume_date,
      autoCollect: subscription.auto_collect,
      data: subscription,
    };

    if (status === 'cancelled') {
      data = { ...data, cancelledAt: subscription.cancelled_at };
    }

    await updateSubscription(subscriptionId, data);

    done();
  } catch (err) {
    console.log(err);
    done(new Error(err.message));
  }
});

queue.on('completed', async (job, result) => {
  console.log('Successfully saved subscription details from zoho');
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
  console.log(
    `New zoho subscription webhook active ${job.data.subscription.subscriptionId}`
  );
});

module.exports = queue;
