const { Subscription, AgencyClient } = require('../models');
const zohoSubscription = require('../utils/zohoSubscription');
const dotenv = require('dotenv');
const { getClient } = require('./agencyClient.service');
dotenv.config({ path: 'config/config.env' });

/**
 * * Get Subscription
 * @param {string} subscriptionId
 * @returns {object} zoho subscription
 */
const getSubscription = async (subscriptionId) => {
  const zoho = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `subscriptions/${subscriptionId}`,
  });
  const subscription = zoho.message == 'success' ? zoho.subscription : {};

  return subscription;
};

/**
 * * Get Subscription By Account Id
 * @param {string} agencyClientId
 * @returns {object} zoho subscription
 */
const getSubscriptionByAgencyClientId = async (agencyClientId) => {
  const client = await getClient(agencyClientId);
  return await getSubscription(client.account.subscription.subscriptionId);
};

/**
 * * Get Subscription
 * @param {string} zohoId
 * @returns {object} zoho subscription
 */
const getSubscriptionByZohoId = async (zohoId) => {
  return await zohoSubscription.callAPI({
    method: 'GET',
    operation: `subscriptions?customer_id=${zohoId}`,
  });
};

/**
 * * Get Subscription Record In Db
 * @param {string} subscriptionId
 * @returns {object} subscription row in db
 */
const getSubscriptionRecord = async (subscriptionId) => {
  return await Subscription.findByPk(subscriptionId);
};

/**
 * * Get Subscription Record By Account Id In Db
 * @param {uuid} accountId
 * @returns {object} subscription row in db
 */
const getSubscriptionRecordByAccountId = async (accountId) => {
  return await Subscription.findOne({ where: { accountId } });
};

/**
 * * Add addon
 * @param {uuid} userId
 * @param {integer} roleId
 * @returns {successCode} integer
 */
const addAddon = async (addon) => {
  const { type, price, addon_code, addon_description, name } = addon;

  const product_id = process.env.ZOHO_PRODUCT_ID;

  const payload = {
    addon_code,
    name,
    description: addon_description,
    unit_name: 'qty',
    pricing_scheme: 'unit',
    price_brackets: [
      {
        price,
      },
    ],
    type,
    product_id,
  };

  try {
    const output = await zohoSubscription.callAPI({
      method: 'post',
      operation: 'addons',
      body: payload,
    });

    const success_code = output.data ? output.data.code : output.code;
    //success_code == 0 || success_code == 100502 ? true : false;
    return success_code;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

/**
 * * Add addon
 * @param {object} data
 * @param {string} subscriptionID
 * @returns {successCode} integer
 */
const addCharge = async (
  { amount, description, add_to_unbilled_charges },
  subscriptionId
) => {
  try {
    const output = await zohoSubscription.callAPI({
      method: 'POST',
      operation: `subscriptions/${subscriptionId}/charge`,
      body: {
        amount,
        description,
        add_to_unbilled_charges,
      },
    });

    const success_code = output?.data ? output?.data.code : output.code;
    //success_code == 0 || success_code == 100502 ? true : false;
    return output;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

/**
 * * Get Subscriptions
 * can be filtered by status, customer_id
 * can be sorted by column
 * @param {object} req
 * @returns {object} {subscriptions,page_context}
 */
const getSubscriptions = async (method, query) => {
  const { status, page, per_page, customer_id, sort_column, sort_order } =
    query;

  // Optional parameter to filter subscriptions by customer id / zoho id
  const customerIdParam = customer_id ? `&customer_id=${customer_id}` : '';

  // Optional to sort the list
  const sortColumnParam = sort_column ? sort_column : 'created_time';
  const sortOrderParam = sort_order ? sort_order : 'D';
  const sort = `&sort_column=${sortColumnParam}&sort_order=${sortOrderParam}`;

  // Page and Per Page
  const pageParam = page ? page : '1';
  const perPageParam = per_page ? per_page : '10';

  const subscriptionStatus =
    status.toLowerCase() == 'all' ? 'All' : status.toUpperCase();
  const output = await zohoSubscription.callAPI({
    method,
    operation: `subscriptions?filter_by=SubscriptionStatus.${subscriptionStatus}&page=${pageParam}&per_page=${perPageParam}${sort}${customerIdParam}`,
  });

  return output;
};

/**
 * * update subscription custom field
 * @param {string} subscriptionId
 * @param {string} label
 * @param {string} value
 * @returns {object} Zoho update custom fields response
 */
const updateCustomField = async (subscriptionId, label, value) => {
  const res = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/customfields`,
    body: {
      custom_fields: [{ label, value }],
    },
  });

  return res;
};

/**
 * * cancel subscription
 * @param {string} subscriptionId
 * @param {string} cancelAtEnd
 * @returns {object} Zoho subscription object
 */
const cancelSubscription = async (subscriptionId, cancelAtEnd) => {
  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/cancel?cancel_at_end=${cancelAtEnd}`,
  });

  const subscription = await Subscription.findByPk(subscriptionId);
  await subscription.update({
    status: 'non_renewing',
  });

  return output;
};

const reactivateSubscription = async (subscriptionId) => {
  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/reactivate`,
  });

  const subscription = await Subscription.findByPk(subscriptionId);
  await subscription.update({
    status: 'live',
  });

  return output;
};

/**
 * Update subscription
 *
 * @param uuid accountId
 * @param int tagId
 * @param object data
 * @returns boolean
 */
const updateSubscription = async (subscriptionId, data) => {
  // const subscription = await Subscription.findByPk(subscriptionId);
  // return await subscription.update(data);
  return await Subscription.upsert({ subscriptionId, ...data });
};

/**
 * Update subscription plan description
 *
 * @param string subscriptionId
 * @param string planCode
 * @param text description
 * @returns object
 */
const updatePlanDescription = async (subscriptionId, planCode, description) => {
  const res = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/lineitems/${planCode}`,
    body: { description },
  });

  return res;
};

/**
 * Add subscription note
 *
 * @param string subscriptionId
 * @param text description
 * @returns object
 */
const addSubscriptionNote = async (subscriptionId, description) => {
  const res = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `subscriptions/${subscriptionId}/notes`,
    body: { description },
  });

  return res;
};

/**
 * Get subscription notes
 *
 * @param string subscriptionId
 * @returns object
 */
const getSubscriptionNotes = async (subscriptionId) => {
  const res = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `subscriptions/${subscriptionId}/notes`,
  });

  return res;
};

/**
 * Delete subscription note
 *
 * @param string subscriptionId
 * @param string noteId
 * @returns object
 */
const deleteSubscriptionNote = async (subscriptionId, noteId) => {
  const res = await zohoSubscription.callAPI({
    method: 'DELETE',
    operation: `subscriptions/${subscriptionId}/notes/${noteId}`,
  });

  return res;
};

const addExtraSubscription = async (subscription) => {};

const saveMultiSubscriptions = async (zohoId) => {
  const output = await getSubscriptionByZohoId(zohoId);

  const { subscriptions, page_context } = output;

  // Promise.all(
  //   subscriptions.map(async (s) => {
  //     await Subscription.upsert({
  //       subscriptionId: u.userId,
  //       status:,
  //       activatedAt:        ,
  //       zohoId:s.customer_id,
  //       data:s,
  //       salesPersonId: uuid,
  //       cancelledAt:,
  //       amount:
  //     });
  //   })
  // );

  subscriptions.map(async (subscription) => {
    return await Subscription.findOne({ where: { accountId } });
  });
};

module.exports = {
  getSubscriptions,
  getSubscriptionByZohoId,
  getSubscription,
  getSubscriptionRecord,
  addAddon,
  addCharge,
  updateCustomField,
  cancelSubscription,
  reactivateSubscription,
  updateSubscription,
  updatePlanDescription,
  addSubscriptionNote,
  getSubscriptionNotes,
  deleteSubscriptionNote,
  getSubscriptionRecordByAccountId,
  getSubscriptionByAgencyClientId,
};
