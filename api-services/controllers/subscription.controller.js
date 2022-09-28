const asyncHandler = require('../middleware/async');
const {
  Subscription,
  Account,
  AgencyClient,
  ClientMigration,
} = require('../models');
const accountService = require('../services/account.service');
const ErrorResponse = require('../utils/errorResponse');
const zohoSubscription = require('../utils/zohoSubscription');
const saveToSiViaWebhook = require('../queues/subscription/saveToSiViaWebhook');
const {
  sendTemporaryLoginEmail,
} = require('../services/clientMigrationService');
const {
  addSubscriptionNote,
  updatePlanDescription,
} = require('../services/subscription.service');
const moment = require('moment');
const {
  addNotification,
} = require('../features/notification/notification.service');
const {
  NOTIFICATION_ENTITY_TYPE,
  NEW_CLIENT_NOTIFIERS,
} = require('../features/notification/utils/constants');
const { getRoleIds } = require('../services/role.service');
const { getUsersByRoleId } = require('../services/user.service');

/**
 * @desc    Get subscriptions
 * @route   GET /v1/subscriptions
 * @param   {uuid} accountId
 */
exports.getSubscriptions = asyncHandler(async (req, res, next) => {
  const { accountId } = req.query;

  const query = {};

  // * Check if accountId is being queried
  if (accountId) {
    query.include = {
      model: Account,
      where: {
        accountId,
      },
      attributes: [],
    };
  }

  const subscriptions = await Subscription.findAll(query);

  res.status(200).json({ success: true, data: subscriptions });
});

/**
 * @desc    Create subscription
 * @route   POST /v1/subscriptions
 * @param   {uuid} accountId
 * @param   {string} hostedPageId
 */
exports.createSubscription = asyncHandler(async (req, res, next) => {
  const { accountId, hostedPageId } = req.query;
  const { userId } = req.user;

  let subscription;

  // * Check if new subscription came from hosted pages
  if (hostedPageId) {
    //console.log(hostedPageId);
    const hostedPage = await zohoSubscription.callAPI({
      method: 'GET',
      operation: `hostedpages/${hostedPageId}`,
    });

    //console.log(hostedPage);

    subscription = hostedPage.data.data.subscription;
  }

  // * Check if new subscription already exists
  const existingSubscription = await Subscription.findByPk(
    subscription.subscription_id
  );

  if (existingSubscription) {
    throw new ErrorResponse('Subscription already exists', 409);
  }

  // * Insert new subscription to database
  await Subscription.create({
    accountId,
    subscriptionId: subscription.subscription_id,
    status: subscription.status,
    activatedAt: subscription.activated_at,
    isOffline: subscription.card ? false : true,
    salesPersonId: subscription.custom_field_hash?.cf_sales_person_id ?? null,
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
    currentTermStartsAt:
      subscription.current_term_starts_at === ''
        ? null
        : subscription.current_term_starts_at,
    currentTermEndsAt:
      subscription.current_term_ends_at === ''
        ? null
        : subscription.current_term_ends_at,
    lastBillingAt:
      subscription.last_billing_at === '' ? null : subscription.last_billing_at,
    nextBillingAt:
      subscription.next_billing_at === '' ? null : subscription.next_billing_at,
    expiresAt: subscription.expires_at === '' ? null : subscription.expires_at,
    pauseDate: subscription.pause_date === '' ? null : subscription.pause_date,
    resumeDate:
      subscription.resume_date === '' ? null : subscription.resume_date,
    autoCollect: subscription.auto_collect,
    data: subscription,
  });

  //  * push webhook to current SI agency app

  const cm = await ClientMigration.findOne({
    where: {
      accountId,
    },
  });

  if (cm) {
    await sendTemporaryLoginEmail(cm);
  } else {
    await saveToSiViaWebhook.add({ accountId, subscription });
  }

  const account = await accountService.getAccountById(accountId);

  // * If account plan is agency, update agency client status to subscribed
  // * and store the customer Id to zohoId field
  if (account.plan.name === 'agency') {
    const agencyClient = await AgencyClient.findOne({
      where: {
        accountId,
      },
    });

    await agencyClient.update({
      status: 'subscribed',
      zohoId: subscription.customer_id,
    });

    await addNotification({
      entityTypeId: NOTIFICATION_ENTITY_TYPE.clientSubscription,
      entityId: agencyClient.agencyClientId,
      status: 'success',
      creatorId: userId,
    });
  }

  await addSubscriptionNote(
    subscription.subscription_id,
    subscription.plan.description
  );
  await updatePlanDescription(
    subscription.subscription_id,
    subscription.plan.plan_code,
    ''
  );

  await res.status(200).json({ success: true, data: account });
});

/**
 * @desc    Get subscription by ID
 * @route   GET /v1/subscriptions/:subscriptionId
 */
exports.getSubscription = asyncHandler(async (req, res, next) => {});

/**
 * @desc    Update subscription by ID
 * @route   PUT /v1/subscriptions/:subscriptionId
 */

exports.updateSubscription = asyncHandler(async (req, res, next) => {});

/**
 * @desc    Delete subscription by ID
 * @route   Delete /v1/subscriptions/:subscriptionId
 */
exports.deleteSubscription = asyncHandler(async (req, res, next) => {});

/**
 * @desc    Generate Hosted page for update card details
 * @route   GET /v1/subscriptions/card-after-success
 */
exports.generateHostedPageForUpdateCard = asyncHandler(
  async (req, res, next) => {
    const { token } = req.body;

    // const uri = decodeURIComponent(token);
    // const subscription_id = Buffer.from(uri, 'base64').toString('ascii');
    const subscription = await Subscription.findOne({
      where: { updateToken: token },
    });

    if (moment().isAfter(subscription.updateTokenExpire)) {
      return res.status(400).send({ message: 'token expired' });
    }

    const output = await zohoSubscription.callAPI({
      method: 'POST',
      operation: 'hostedpages/updatecard',
      body: {
        subscription_id: subscription.subscriptionId,
        auto_collect: true,
        redirect_url: `${process.env.SITE_URL}/update-card-success`,
      },
    });

    //subscription = hostedPage.data.data.subscription;
    res.status(200).json({ success: true, output: output.data.hostedpage });
  }
);

/**
 * @desc    Update card success follow through
 * @route   GET /v1/subscriptions/card-after-success
 */
exports.updateCardSuccess = asyncHandler(async (req, res, next) => {
  const { hostedPageId } = req.query;

  const hostedPage = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `hostedpages/${hostedPageId}`,
  });

  //console.log(hostedPage.data.data);
  const autoCollect = hostedPage.data.data.subscription.auto_collect;
  const accountId = hostedPage.data.data.subscription.reference_id;

  const subscription = await Subscription.findOne({ where: { accountId } });
  await subscription.update({
    isOffline: !autoCollect,
    updateToken: null,
    updateTokenExpire: null,
  });

  //subscription = hostedPage.data.data.subscription;
  res.status(200).json({ success: true });
});
