const asyncHandler = require('../../middleware/async');
const {
  Commission,
  Subscription,
  AgencyClient,
  Termination,
} = require('../../models');
const moment = require('moment');
const userService = require('../../services/user.service');
const zohoSubscription = require('../../utils/zohoSubscription');
const saveToSiViaWebhook = require('../../queues/subscription/saveToSiViaWebhook');
const syncStatus = require('../../queues/subscription/syncStatus');
const sendRawEmail = require('../../queues/ses/sendRawEmail');
const ErrorResponse = require('../../utils/errorResponse');
const {
  addAddon,
  getSubscriptions,
  updateCustomField,
  reactivateSubscription,
  updatePlanDescription,
  addSubscriptionNote,
  getSubscriptionNotes,
  deleteSubscriptionNote,
  getSubscriptionByAgencyClientId,
  getSubscriptionByZohoId,
} = require('../../services/subscription.service');
const path = require('path');
const fs = require('fs');
const { updateTermination } = require('../../services/termination.service');
const { generateInviteToken } = require('../../services/invite.service');

moment.tz.setDefault('America/Toronto');
// @desc     Consume new subscription webhook from Zoho Subscriptions
// @route    POST /api/v1/agency/subscription/new
// @access   PUBLIC
exports.newSubscriber = asyncHandler(async (req, res) => {
  const { body } = req;

  try {
    if (body.data) {
      const { subscription } = body.data;
      // await saveNewSubscription.add({ subscription });
    }
  } catch (err) {
    console.log(err);
  }

  res.status(200).end();
});

// @desc     Consume subscription update status webhook from Zoho Subscriptions
// @route    POST /api/v1/agency/subscription/syncstatus
// @access   PUBLIC
exports.syncStatus = asyncHandler(async (req, res) => {
  const { body } = req;
  try {
    if (body.data) {
      const { subscription } = body.data;
      await syncStatus.add({ subscription, loaded: true });
      // await saveNewSubscription.add({ subscription });
    }
  } catch (err) {
    console.log(err);
  }

  res.status(200).end();
});

// @desc     Save zoho subscription data to local db
// @route    POST /api/v1/agency/subscription/:subscriptionId/sync
// @access   PUBLIC
exports.syncData = asyncHandler(async (req, res) => {
  const { subscriptionId } = req.params;
  try {
    console.log(subscriptionId);
    await syncStatus.add({ subscription: { subscriptionId }, loaded: false });
  } catch (err) {
    console.log(err);
  }

  res.status(200).end();
});

// @desc     Get All Subscriptions filtered by Status
// @route    GET /api/v1/agency/subscription?status={status}&page={page}&per_page={per_page}
// @params   Possible values for status are All, ACTIVE, LIVE, FUTURE, TRIAL, PAST_DUE, UNPAID, NON_RENEWING, CANCELLED_FROM_DUNNING,
// @params     CANCELLED, EXPIRED, TRIAL_EXPIRED, CANCELLED_LAST_MONTH, CANCELLED_THIS_MONTH.
// @ref      https://www.zoho.com/subscriptions/api/v1/#Subscriptions_List_all_subscriptions
// @access   Private
exports.getSubscriptions = asyncHandler(async (req, res, next) => {
  const { method, query } = req;

  const output = await getSubscriptions(method, query);

  const {
    data: { subscriptions, page_context },
  } = output;

  res.status(200).json({
    success: true,
    data: subscriptions,
    page_context,
  });
});

exports.getSubscriptionsByZohoId = asyncHandler(async (req, res, next) => {
  const { zohoId } = req.params;

  const output = await getSubscriptionByZohoId(zohoId);

  const { subscriptions, page_context } = output;

  res.status(200).json({
    success: true,
    data: subscriptions,
    page_context,
  });
});

// @desc     Get Subscription Details
// @route    GET /api/v1/agency/subscription/{subscriptionId}
// @access   Private
exports.getSubscription = asyncHandler(async (req, res, next) => {
  const { subscriptionId } = req.params;

  const zoho = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `subscriptions/${subscriptionId}`,
  });

  const subscription = zoho.message == 'success' ? zoho.subscription : {};

  const scheduledChanges = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `subscriptions/${subscriptionId}/scheduledchanges`,
  });

  const pendingInvoices = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `invoices?filter_by=Status.Draft&subscription_id=${subscriptionId}`,
  });

  const subscriptionRecord = await Subscription.findByPk(subscriptionId);

  const client = await AgencyClient.findOne({
    where: { accountId: subscription.reference_id },
  });

  if (subscriptionRecord.status !== subscription.status) {
    subscriptionRecord.update({
      status: subscription.status,
      cancelledAt:
        subscription.status === 'cancelled' ? subscription.cancelled_at : null,
    });

    client.update({
      status: subscription.status === 'cancelled' ? 'cancelled' : 'subscribed',
    });
  } else {
    if (
      subscriptionRecord.status === 'cancelled' &&
      client.status === 'subscribed'
    ) {
      client.update({
        status: 'cancelled',
      });
    }

    if (
      subscriptionRecord.status === 'expired' &&
      client.status === 'subscribed'
    ) {
      client.update({
        status: 'cancelled',
      });
      subscriptionRecord.update({
        cancelledAt: subscription.expires_at,
      });
    }

    if (
      subscriptionRecord.status === 'cancelled' &&
      !subscriptionRecord.cancelledAt
    ) {
      subscriptionRecord.update({
        cancelledAt: subscription.cancelled_at,
      });
    }
  }

  const termination = await Termination.findOne({
    where: { agencyClientId: client.agencyClientId },
  });

  // const commissions = await Commission.findAll({
  //   where: { subscriptionId },
  // });

  res.status(200).json({
    success: true,
    subscription,
    subscriptionRecord,
    scheduledChanges,
    pendingInvoices,
    termination,
    //commissions,
  });
});

exports.getSubscriptionByAgencyClientId = asyncHandler(
  async (req, res, next) => {
    const { agencyClientId } = req.params;
    const subscription = await getSubscriptionByAgencyClientId(agencyClientId);

    res.status(200).json({
      success: true,
      subscription,
    });
  }
);

exports.getCommissions = asyncHandler(async (req, res, next) => {
  const { subscriptionId } = req.params;

  const commissions = await Commission.findAll({
    where: { subscriptionId },
  });

  res.status(200).json({
    success: true,
    commissions,
  });
});

// @desc     Create a Zoho Hosted Page for a new subscription
// @route    POST /api/v1/agency/subscription
// @access   Private
exports.addSubscription = asyncHandler(async (req, res, next) => {
  const {
    reference_id,
    customer_name,
    email,
    currency_code,
    pricebook_id,
    plan_code,
    plan_description,
    price,
    convert_retainer_cycle,
    retainer_after_convert,
    billing_cycles,
    addons,
    display_name,
    first_name,
    last_name,
    company_name,
    billing_address,
    salesperson_id,
    salesperson_name,
  } = req.body;

  let change_retainer_date =
    convert_retainer_cycle == ''
      ? null
      : moment().add(convert_retainer_cycle, 'M').format('YYYY-MM-DD');

  const custom_fields = change_retainer_date
    ? [
        {
          label: 'convert_on_cycle',
          value: convert_retainer_cycle == '' ? 0 : convert_retainer_cycle,
        },
        {
          label: 'convert_on_cycle_date',
          value: change_retainer_date,
        },
        {
          label: 'retainer_after_convert',
          value: retainer_after_convert,
        },
        {
          label: 'salesperson_id',
          value: salesperson_id,
        },
      ]
    : [];

  let plan = {
    plan_code,
    plan_description,
    price,
    quantity: 1,
  };

  if (billing_cycles !== '') {
    plan = { ...plan, billing_cycles };
  }

  let customer = {
    display_name,
    first_name,
    last_name,
    email,
    company_name,
    billing_address,
    currency_code,
    payment_terms: process.env.ZOHO_PAYMENT_TERMS,
    payment_terms_label: process.env.ZOHO_PAYMENT_TERMS_LABEL,
  };

  if (billing_address.country === 'Canada') {
    const { taxes } = await zohoSubscription.callAPI({
      method: 'GET',
      operation: 'settings/taxes',
    });

    const { tax_id, tax_authority_id, tax_authority_name } = taxes.find(
      ({ tax_name }) => tax_name === billing_address.state
    );

    customer = {
      ...customer,
      is_taxable: true,
      tax_id,
      tax_authority_id,
      tax_authority_name,
    };
  }

  let payload = {
    customer,
    plan,
    addons,
    custom_fields,
    reference_id,
    redirect_url: `${process.env.SITE_URL}/subscription/confirmation`,
  };

  if (currency_code !== 'USD') {
    payload = { ...payload, pricebook_id };
  }
  if (salesperson_id && salesperson_name !== '') {
    payload = { ...payload, salesperson_name };
  }

  try {
    const subscriptionResponse = await zohoSubscription.callAPI({
      method: 'POST',
      operation: 'hostedpages/newsubscription',
      body: payload,
    });

    if (
      (subscriptionResponse.data && subscriptionResponse.data.code !== 0) ||
      (!subscriptionResponse.data && subscriptionResponse.code > 0)
    ) {
      throw new ErrorResponse(
        'Failed creating hosted page for new subscription',
        400,
        subscriptionResponse
      );
    } else {
      res.status(200).json({
        success: true,
        output: subscriptionResponse.data.hostedpage,
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.errors?.message });
  }
});

// @desc     Create a Zoho Hosted Page for a new subscription
// @route    POST /api/v1/agency/subscription
// @access   Private
exports.addSubscriptionZohoClient = asyncHandler(async (req, res, next) => {
  const {
    reference_id,
    currency_code,
    pricebook_id,
    plan_code,
    plan_description,
    price,
    convert_retainer_cycle,
    retainer_after_convert,
    billing_cycles,
    addons,
    customer_id,
    salesperson_id,
    salesperson_name,
  } = req.body;

  let change_retainer_date =
    convert_retainer_cycle == ''
      ? null
      : moment().add(convert_retainer_cycle, 'M').format('YYYY-MM-DD');

  const custom_fields = change_retainer_date
    ? [
        {
          label: 'convert_on_cycle',
          value: convert_retainer_cycle == '' ? 0 : convert_retainer_cycle,
        },
        {
          label: 'convert_on_cycle_date',
          value: change_retainer_date,
        },
        {
          label: 'retainer_after_convert',
          value: retainer_after_convert,
        },
        {
          label: 'salesperson_id',
          value: salesperson_id,
        },
      ]
    : [];

  let plan = {
    plan_code,
    plan_description,
    price,
    quantity: 1,
  };

  if (billing_cycles !== '') {
    plan = { ...plan, billing_cycles };
  }

  let payload = {
    customer_id,
    plan,
    addons,
    custom_fields,
    reference_id,
    redirect_url: `${process.env.SITE_URL}/subscription/confirmation`,
  };

  if (currency_code !== 'USD') {
    payload = { ...payload, pricebook_id };
  }

  if (salesperson_id && salesperson_name !== '') {
    payload = { ...payload, salesperson_name };
  }

  try {
    const subscriptionResponse = await zohoSubscription.callAPI({
      method: 'POST',
      operation: 'hostedpages/newsubscription',
      body: payload,
    });

    console.log(subscriptionResponse, 'ssss');
    if (subscriptionResponse && subscriptionResponse.data) {
      if (subscriptionResponse.data.code === 0) {
        res.status(200).json({
          success: true,
          output: subscriptionResponse.data.hostedpage,
        });
      } else {
        throw new ErrorResponse(
          'Failed creating hosted page for new subscription',
          400,
          subscriptionResponse
        );
      }
    } else {
      throw new ErrorResponse(
        subscriptionResponse.message,
        400,
        subscriptionResponse
      );
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// @desc     Create a new zoho offline subscription
// @route    POST /api/v1/agency/subscription/offline
// @access   Private
exports.addOfflineSubscription = asyncHandler(async (req, res, next) => {
  const {
    reference_id,
    client: customer_name,
    email,
    currency_code,
    pricebook_id,
    plan_code,
    plan_description,
    price,
    convert_retainer_cycle,
    retainer_after_convert,
    charge_admin_fee,
    billing_cycles,
    addons,
    zohoId,
    salesPerson,
  } = req.body;

  let change_retainer_date =
    convert_retainer_cycle == ''
      ? null
      : moment().add(convert_retainer_cycle, 'M').format('YYYY-MM-DD');

  let custom_fields = change_retainer_date
    ? [
        {
          label: 'convert_on_cycle',
          value: convert_retainer_cycle == '' ? 0 : convert_retainer_cycle,
        },
        {
          label: 'convert_on_cycle_date',
          value: change_retainer_date,
        },
        {
          label: 'retainer_after_convert',
          value: retainer_after_convert,
        },
      ]
    : [];

  custom_fields.push({
    label: 'pause collect',
    value: true,
  });

  custom_fields.push({
    label: 'charge_admin_fee',
    value: charge_admin_fee,
  });

  const sp = salesPerson ? await userService.getUserById(salesPerson) : null;

  if (sp) {
    custom_fields.push({
      label: 'salesperson_id',
      value: salesPerson,
    });
  }

  let plan = {
    plan_code,
    plan_description,
    price,
    quantity: 1,
  };

  if (billing_cycles !== '') {
    plan = { ...plan, billing_cycles };
  }

  let initialPrice = price;
  addons.map((addon) => {
    initialPrice += addon.price;
  });

  let final_addons = addons;

  // Added condition, since sometimes the admin fee is waived
  if (charge_admin_fee) {
    const admin_fee = (initialPrice * 3) / 100; // initial 3% admin fee for offline subscription
    final_addons = [
      ...addons,
      {
        addon_code: 'admin-fee',
        addon_description: '',
        name: 'Admin Fee',
        price: admin_fee,
        quantity: 1,
        type: 'one_time',
      },
    ];
  }

  let payload = {
    customer: {
      display_name: customer_name,
      email,
      currency_code,
      payment_terms: process.env.ZOHO_PAYMENT_TERMS,
      payment_terms_label: process.env.ZOHO_PAYMENT_TERMS_LABEL,
    },
    payment_terms: process.env.ZOHO_PAYMENT_TERMS,
    payment_terms_label: process.env.ZOHO_PAYMENT_TERMS_LABEL,
    plan,
    addons: final_addons,
    custom_fields,
    reference_id,
    auto_collect: false,
  };

  // payload for offline client with existing zoho customer id
  if (zohoId && zohoId !== '') {
    payload = {
      customer_id: zohoId,
      payment_terms: process.env.ZOHO_PAYMENT_TERMS,
      payment_terms_label: process.env.ZOHO_PAYMENT_TERMS_LABEL,
      plan,
      addons: final_addons,
      custom_fields,
      reference_id,
      auto_collect: false,
    };
  }

  if (currency_code !== 'USD') {
    payload = { ...payload, pricebook_id };
  }

  if (sp) {
    payload = {
      ...payload,
      salesperson_name: `${sp.firstName} ${sp.lastName}`,
    };
  }

  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: 'subscriptions',
    body: payload,
  });

  const { data } = output;

  //console.log(output, data);
  if (data && data.code == 0) {
    let subscription = output.data.subscription;

    // * Insert new subscription to database
    await Subscription.create({
      accountId: reference_id,
      subscriptionId: subscription.subscription_id,
      status: subscription.status,
      activatedAt: subscription.activated_at,
      isOffline: true,
      salesPersonId: sp ? salesPerson : null,
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
    });

    await AgencyClient.update(
      { status: 'subscribed', zohoId: subscription.customer_id },
      {
        where: { accountId: reference_id },
      }
    );

    await saveToSiViaWebhook.add({ accountId: reference_id, subscription });

    res.status(200).json({
      success: true,
      output: data,
    });
  } else {
    res.status(400).json(output);
  }
});

// @desc     Edit Zoho Subscription
// @route    PUT /api/v1/agency/subscription/{subscriptionId}
// @access   Private
exports.editSubscription = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
    body: {
      plan_code,
      plan_description,
      price,
      addons,
      auto_collect,
      card_id,
      apply_changes,
    },
  } = req;

  let plan = {
    plan_code,
    plan_description,
    price,
    quantity: 1,
  };

  //const myAddons = addons.map((a) => ({ addon_code: a.addon_code, addon }));

  // let change_retainer_date =
  //   convert_retainer_cycle == ''
  //     ? null
  //     : moment(starts_at).add(convert_retainer_cycle, 'M').format('YYYY-MM-DD');

  // const custom_fields = change_retainer_date
  //   ? [
  //       {
  //         label: 'convert_on_cycle',
  //         value: convert_retainer_cycle == '' ? 0 : convert_retainer_cycle,
  //       },
  //       {
  //         label: 'convert_on_cycle_date',
  //         value: change_retainer_date,
  //       },
  //       {
  //         label: 'retainer_after_convert',
  //         value: retainer_after_convert,
  //       },
  //     ]
  //   : [];

  let payload = {
    card_id,
    plan,
    addons,
    end_of_term: apply_changes == 'immediately' ? false : true,
  };

  // if (custom_fields.length > 0) {
  //   payload = { ...payload, custom_fields };
  // }

  try {
    const output = await zohoSubscription.callAPI({
      method: 'PUT',
      operation: `subscriptions/${subscriptionId}`,
      body: payload,
    });

    if (output.code === 0) {
      if (apply_changes == 'immediately') {
        const subscription = await Subscription.findByPk(subscriptionId);

        const client = await AgencyClient.findOne({
          where: { accountId: subscription.accountId },
        });

        if (client.status === 'cancelled') {
          await client.update({ status: 'subscribed' });
        }

        const termination = await Termination.findOne({
          where: { agencyClientId: client.agencyClientId },
        });
        if (termination) {
          await termination.update({ status: 'cancelled' });
          await termination.destroy();
        }
      }
    }

    res.status(200).json({
      success: true,
      output,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.response,
    });
  }
});

// @desc     Get a Subscription's latest Invoice Details
// @route    GET /api/v1/agency/subscription/{subscriptionId}/latestinvoice
// @access   Private
exports.getLatestInvoice = asyncHandler(async (req, res, next) => {
  const {
    method,
    params: { subscriptionId },
  } = req;

  const output = await zohoSubscription.callAPI({
    method,
    operation: `subscriptions/${subscriptionId}`,
  });

  if (output.code == 0) {
    const {
      subscription: { child_invoice_id },
    } = output;

    const inv_data = await zohoSubscription.callAPI({
      method,
      operation: `invoices/${child_invoice_id}`,
    });

    if (inv_data.code == 0) {
      res.status(200).json({
        success: true,
        data: inv_data.invoice,
      });
    } else {
      res.status(400).json({
        success: false,
        output,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      output,
    });
  }
});

// @desc     Get a Subscription's recent activities
// @route    GET /api/v1/agency/subscription/{subscriptionId}/recentactivities
// @access   Private
exports.getRecentActivities = asyncHandler(async (req, res, next) => {
  const {
    method,
    params: { subscriptionId },
  } = req;

  const output = await zohoSubscription.callAPI({
    method,
    operation: `subscriptions/${subscriptionId}/recentactivities`,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Get a Subscription's scheduled changes
// @route    GET /api/v1/agency/subscription/{subscriptionId}/scheduledchanges
// @access   Private
exports.getScheduledChanges = asyncHandler(async (req, res, next) => {
  const {
    method,
    params: { subscriptionId },
  } = req;

  const output = await zohoSubscription.callAPI({
    method,
    operation: `subscriptions/${subscriptionId}/scheduledchanges`,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Drop a Subscription's scheduled changes
// @route    DELETE /api/v1/agency/subscription/{subscriptionId}/scheduledchanges
// @access   Private
exports.dropScheduledChanges = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
  } = req;

  const output = await zohoSubscription.callAPI({
    method: 'DELETE',
    operation: `subscriptions/${subscriptionId}/scheduledchanges`,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Create A Zoho Hosted Page for a client to update their card details
// @route    POST /api/v1/agency/subscription/{subscriptionId}/updatecard
// @access   Private
exports.updateCardDetails = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId: subscription_id },
  } = req;

  try {
    // const output = await zohoSubscription.callAPI({
    //   method: 'POST',
    //   operation: 'hostedpages/updatecard',
    //   body: {
    //     subscription_id,
    //     auto_collect: true,
    //     redirect_url: `${process.env.SITE_URL}/update-card-success`,
    //   },
    // });
    //if (output.data.code == 0) {
    const subscription = await Subscription.findByPk(subscription_id);
    const account = await subscription.getAccount();
    const agencyClient = await account.getAgencyClient();
    const defaultContact = await agencyClient.getDefaultContact();

    const updateToken = await generateInviteToken();

    await subscription.update({
      updateToken,
      updateTokenExpire: new Date(Date.now() + 48 * (60 * 60 * 1000)),
    });

    let link = `${process.env.SITE_URL}/update-card/permit/${updateToken}`;

    const subject = 'BetterSeller - Update your payment details';

    let filePath = path.join(
      __dirname,
      `../../email-templates/update-payment-details-en.html`
    );

    let template = fs.readFileSync(
      filePath,
      { encoding: 'utf-8' },
      function (err) {
        console.log(err);
      }
    );

    let message = template
      .replace('{{name}}', agencyClient.client)
      .replace('{{link}}', link);

    await sendRawEmail.add(
      { email: defaultContact.email, subject, message },
      {
        attempts: 5,
        backoff: 1000 * 60 * 1,
      }
    );

    res.status(200).json({
      success: true,
      //output: output.data.hostedpage,
    });
    //}
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.response,
    });
  }
});

// @desc     Change AutoCollect status: Offline|Online
// @route    POST /api/v1/agency/subscription/{subscriptionId}/autocollect
// @access   Private
exports.changeAutoCollect = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
    body: { auto_collect },
  } = req;

  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/autocollect`,
    body: {
      auto_collect,
    },
  });

  await updateCustomField(subscriptionId, 'pause collect', !auto_collect);

  const subscription = await Subscription.findByPk(subscriptionId);
  await subscription.update({ isOffline: !auto_collect });

  res.status(200).json({
    success: true,
    output: output.data,
  });
});

// @desc     Cancel subscription
// @route    POST /api/v1/agency/subscription/{subscriptionId}/cancel?cancelAtEnd
// @access   Private
exports.cancelSubscription = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
    body: { cancelAtEnd },
  } = req;

  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/cancel?cancel_at_end=${cancelAtEnd}`,
  });

  const subscription = await Subscription.findByPk(subscriptionId);

  await subscription.update({
    status: cancelAtEnd ? 'non_renewing' : 'cancelled',
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Reactivate subscription
// @route    POST /api/v1/agency/subscription/{subscriptionId}/reactivate
// @access   Private
exports.reactivateSubscription = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
  } = req;

  const output = await reactivateSubscription(subscriptionId);

  const subscription = await Subscription.findByPk(subscriptionId);

  const client = await AgencyClient.findOne({
    where: { accountId: subscription.accountId },
  });

  const termination = await Termination.findOne({
    where: { agencyClientId: client.agencyClientId },
  });
  if (termination) {
    termination.update({ status: 'cancelled' });
  }

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete subscription
// @route    POST /api/v1/agency/subscription/{subscriptionId}/cancel?cancelAtEnd
// @access   Private
exports.deleteSubscription = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
  } = req;

  const output = await zohoSubscription.callAPI({
    method: 'DELETE',
    operation: `subscriptions/${subscriptionId}`,
  });

  await Subscription.destroy({
    where: { subscriptionId: subscriptionId },
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Add One-Time Charge
// @route    POST /api/v1/agency/subscription/{subscriptionId}/addcharge
// @access   Private
exports.addCharge = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
    body: { amount, description, addToUnbilledCharge: add_to_unbilled_charges },
  } = req;

  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/charge`,
    body: {
      amount,
      description,
      add_to_unbilled_charges,
    },
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Add One-Time Addon
// @route    POST /api/v1/agency/subscription/{subscriptionId}/buyonetimeaddon
// @access   Private
exports.buyOneTimeAddon = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
    body: { addons },
  } = req;

  const addonsResponse = await Promise.all(
    addons.map(async (addon) => {
      return await addAddon(addon);
    })
  );

  // * Check if every add-on has been added(0) or already exists(100502)
  if (!addonsResponse.every((code) => code === 0 || code === 100502)) {
    throw new ErrorResponse('Failed to create add-ons.', 400, addonsResponse);
  }

  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/buyonetimeaddon`,
    body: {
      addons,
      add_to_unbilled_charges: false,
    },
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Extend Billing Cycle
// @route    POST /api/v1/agency/subscription/{subscriptionId}/extendbillingcycle
// @access   Private
exports.extendBillingCycle = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
    body: { billing_cycles },
  } = req;

  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/extend`,
    body: {
      billing_cycles,
    },
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Pause Subscription
// @route    POST /api/v1/agency/subscription/{subscriptionId}/pause
// @access   Private
exports.pauseSubscription = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
  } = req;

  const subscription = await Subscription.findByPk(subscriptionId);
  const currentStatus = subscription.status;

  if (currentStatus === 'unpaid' || currentStatus === 'dunning') {
    const auto_collect = false;
    await zohoSubscription.callAPI({
      method: 'POST',
      operation: `subscriptions/${subscriptionId}/autocollect`,
      body: {
        auto_collect,
      },
    });
    await updateCustomField(subscriptionId, 'pause collect', !auto_collect);
    await subscription.update({ isOffline: !auto_collect });
  }

  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/pause`,
    body: {
      pause_at: moment().format('YYYY-MM-DD'),
      reason: `paused subscription at ${moment().format('YYYY-MM-DD')}`,
    },
  });

  //const subscription = await Subscription.findByPk(subscriptionId);
  await subscription.update({
    status: 'paused',
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Resume Subscription
// @route    POST /api/v1/agency/subscription/{subscriptionId}/resume
// @access   Private
exports.resumeSubscription = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
  } = req;

  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/resume`,
    body: {
      resume_at: moment().format('YYYY-MM-DD'),
      reason: `resumed subscription at ${moment().format('YYYY-MM-DD')}`,
    },
  });

  const subscription = await Subscription.findByPk(subscriptionId);
  await subscription.update({
    status: 'live',
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Change Renewal Billing Date
// @route    POST /api/v1/agency/subscription/{subscriptionId}/postpone
// @access   Private
exports.postponeRenewal = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
    body: { renewal_at },
  } = req;

  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/postpone`,
    body: {
      renewal_at,
    },
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Update custom fields
// @route    POST /api/v1/agency/subscription/{subscriptionId}/customfields
// @access   Private
exports.updateCustomField = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
    body: { label, value },
  } = req;

  const output = await updateCustomField(subscriptionId, label, value);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Update Subscription description
// @route    POST /api/v1/agency/subscription/{subscriptionId}/lineitems/{plan_code}
// @access   Private
exports.updatePlanDescription = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId, planCode },
    body: { description },
  } = req;

  const output = await updatePlanDescription(
    subscriptionId,
    planCode,
    description
  );

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Add Subscription Note
// @route    POST /api/v1/agency/subscription/{subscriptionId}/notes
// @access   Private
exports.addNote = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
    body: { description },
  } = req;

  const output = await addSubscriptionNote(subscriptionId, description);

  res.status(200).json({
    success: true,
    output: output.data,
  });
});

// @desc     Get Subscription Notes
// @route    GET /api/v1/agency/subscription/{subscriptionId}/notes
// @access   Private
exports.getNotes = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId },
  } = req;

  const output = await getSubscriptionNotes(subscriptionId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete Subscription Note
// @route    DELETE /api/v1/agency/subscription/{subscriptionId}/notes/{noteId}
// @access   Private
exports.deleteNote = asyncHandler(async (req, res, next) => {
  const {
    params: { subscriptionId, noteId },
  } = req;

  const output = await deleteSubscriptionNote(subscriptionId, noteId);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Get Subscription Pending Invoices
// @route    GET /api/v1/agency/subscription/{subscriptionId}/pendinginvoices
// @access   Private
exports.getPendingInvoices = asyncHandler(async (req, res, next) => {
  const { subscriptionId } = req.params;

  const output = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `invoices?filter_by=Status.Draft&subscription_id=${subscriptionId}`,
  });

  res.status(200).json({
    success: true,
    output,
  });
});
