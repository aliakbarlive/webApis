const zohoSubscription = require('../utils/zohoSubscription');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

// @desc     Get All Zoho Customers filtered by Status
// @route    GET /api/v1/agency/subscription?status={status}&page={page}&per_page={per_page}
// @params   Possible values for status are All, Active, Inactive, Gapps, Crm, NonSubscribers, PortalEnabled, PortalDisabled
// @ref      https://www.zoho.com/subscriptions/api/v1/?src=subscriptions-webapp#Customers_List_all_customers
// @ref      https://help.zoho.com/portal/en/community/topic/search-api-for-zoho-subscription
// @access   Private
const getZohoCustomers = async (query) => {
  const { status, search } = query;

  const subscriptionStatus =
    status.toLowerCase() == 'all' ? 'All' : status.toUpperCase();

  const searchParam = search
    ? `&search_text=${encodeURIComponent(search)}`
    : '';

  const operation = `customers?filter_by=Status.${subscriptionStatus}${searchParam}`;

  const output = await zohoSubscription.callAPI({
    method: 'GET',
    operation,
  });

  return output;
};

const getZohoCustomer = async (id) => {
  const output = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `customers/${id}`,
  });
  return output;
};

module.exports = {
  getZohoCustomers,
  getZohoCustomer,
};
