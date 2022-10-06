const asyncHandler = require('../../middleware/async');
const { BillingCurrency } = require('../../models');
const axios = require('axios');
const zohoSubscription = require('../../utils/zohoSubscription');

// @desc     Manually Refresh Zoho Subscription OAuth Token
// @route    POST /api/v1/agency/invoicing/refreshToken
// @access   Private
exports.refreshToken = asyncHandler(async (req, res, next) => {
  await zohoSubscription.refreshAccessToken();

  const token = zohoSubscription.access_token;

  res.status(200).json({
    success: true,
    token,
  });
});

// @desc     Get Miscellaneous Zoho Subscription Data
// @route    GET /api/v1/agency/invoicing/list?operation={operation}
// @params   Allowed values for operation: currencies, products, plans, addons, pricebooks
// @access   Private
exports.list = asyncHandler(async (req, res, next) => {
  const {
    method,
    query: { operation, filter, status },
  } = req;

  let apiCall = '';
  switch (operation) {
    case 'currencies':
      apiCall = 'settings/currencies';
      break;
    case 'products':
      apiCall = `products?filter_by=ProductStatus.All`;
      break;
    case 'plans':
      apiCall = `plans?filter_by=PlanStatus.All`;
      break;
    case 'addons':
      let planfilter = filter ? `&plan_code=${filter}` : '';
      let addonStatus = status ? status : 'ACTIVE';
      apiCall = `addons?filter_by=AddonStatus.${addonStatus}${planfilter}`;
      break;
    default:
      apiCall = operation;
      break;
  }

  try {
    const output = await zohoSubscription.callAPI({
      method,
      operation: apiCall,
    });

    res.status(200).json({
      success: true,
      data: output[operation],
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// @desc     Get all hosted pages
// @route    GET /api/v1/agency/invoicing/hostedpages
// @access   Private
exports.getHostedPages = asyncHandler(async (req, res, next) => {
  const {
    method,
    query: { page, per_page },
  } = req;

  const output = await zohoSubscription.callAPI({
    method,
    operation: `hostedpages?page=${page}&per_page=${per_page}&sort_order=D`,
  });

  const {
    data: { hostedpages, page_context },
  } = output;

  res.status(200).json({
    success: true,
    hostedpages,
    page_context,
  });
});

exports.getHostedPage = asyncHandler(async (req, res, next) => {
  const {
    method,
    params: { id },
  } = req;

  console.log(id, 'id');

  const output = await zohoSubscription.callAPI({
    method,
    operation: `hostedpages/${id}`,
  });

  res.status(200).json({
    success: true,
    output: output,
  });
});

// @desc     Add new pricebook
// @route    POST /api/v1/agency/invoicing/pricebooks
// @params   Allowed values for operation: currencies, products, plans, addons, pricebooks
// @access   Private
exports.addPriceBook = asyncHandler(async (req, res, next) => {
  const { method, body } = req;

  const output = await zohoSubscription.callAPI({
    method,
    operation: 'pricebooks',
    body,
  });

  res.status(200).json({
    success: true,
    output: output.data,
  });
});

// @desc     Get Open Exchange Rates Data - hourly (free account only refreshes hourly)
// @route    GET /api/v1/agency/invoicing/exchangerates
// @access   Private
exports.getExchangeRates = asyncHandler(async (req, res, next) => {
  // const redis = new Redis({
  //   port: process.env.REDIS_PORT,
  //   host: process.env.REDIS_HOST, password: process.env.REDIS_PASSWORD,
  //   password: process.env.REDIS_PASSWORD
  // });

  try {
    const data = await axios.get(
      `https://openexchangerates.org/api/latest.json?app_id=${process.env.OXR_APP_ID}`
    );
    // redis.setex('rates', 3600, JSON.stringify(data.data));

    res.status(200).send({
      data: data.data,
      message: 'retrieved from api and cached',
    });

    // let rates = await redis.get('rates');
    // if (rates) {
    //   res.status(200).send({
    //     data: JSON.parse(rates),
    //     message: 'data retrieved from the cache',
    //   });
    // } else {
    //   const data = await axios.get(
    //     `https://openexchangerates.org/api/latest.json?app_id=${process.env.OXR_APP_ID}`
    //   );
    //   redis.setex('rates', 3600, JSON.stringify(data.data));

    //   res.status(200).send({
    //     data: data.data,
    //     message: 'retrieved from api and cached',
    //   });
    // }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// @desc     Add allowed billing currency
// @route    POST /api/v1/agency/invoicing/currency
// @access   Private
exports.addCurrency = asyncHandler(async (req, res, next) => {
  const { body } = req;

  const output = await BillingCurrency.upsert(body);

  res.status(200).json({
    success: true,
    output: output,
  });
});

// @desc     Get all allowed billing currencies
// @route    GET /api/v1/agency/invoicing/currency
// @access   Private
exports.getCurrency = asyncHandler(async (req, res, next) => {
  const output = await BillingCurrency.findAll();

  res.status(200).json({
    success: true,
    output: output,
  });
});

exports.getWebhooks = asyncHandler(async (req, res, next) => {
  const {
    method,
    query: { page, per_page },
  } = req;

  const output = await zohoSubscription.callAPI({
    method,
    operation: `webhooks?page=${page}&per_page=${per_page}`,
  });

  const {
    data: { webhooks, page_context },
  } = output;

  res.status(200).json({
    success: true,
    webhooks,
    page_context,
  });
});

exports.getWebhook = asyncHandler(async (req, res, next) => {
  const {
    method,
    params: { id },
  } = req;

  const output = await zohoSubscription.callAPI({
    method,
    operation: `webhooks/${id}`,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

exports.addAddon = asyncHandler(async (req, res, next) => {
  const {
    body: { addon_code, name, unit_name, pricing_scheme, price_brackets, type },
  } = req;

  const product_id = process.env.ZOHO_PRODUCT_ID;

  const payload = {
    addon_code,
    name,
    unit_name,
    pricing_scheme,
    price_brackets,
    type,
    product_id,
  };

  try {
    const output = await zohoSubscription.callAPI({
      method: 'post',
      operation: 'addons',
      body: payload,
    });

    const data = output.data ? output.data : output.message;

    res.status(200).json({
      success: true,
      output: data,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

exports.getEvents = asyncHandler(async (req, res, next) => {
  const {
    query: { status, page, sizePerPage },
  } = req;

  try {
    const output = await zohoSubscription.callAPI({
      method: 'GET',
      operation: `events?filter_by=EventType.${status}&page=${page}&per_page=${sizePerPage}&sort_column=event_time&sort_order=D`,
    });

    const { events, page_context } = output.data;
    res.status(200).json({
      success: true,
      data: {
        rows: events,
        page: page_context.page,
        sizePerPage: page_context.per_page,
        has_more_page: page_context.has_more_page,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

exports.getEvent = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;

  try {
    const output = await zohoSubscription.callAPI({
      method: 'GET',
      operation: `events/${id}`,
    });

    res.status(200).json({
      success: true,
      data: output,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

exports.getPayments = asyncHandler(async (req, res, next) => {
  const { status, page, sizePerPage } = req.query;

  try {
    const output = await zohoSubscription.callAPI({
      method: 'GET',
      operation: `payments?filter_by=${status}&page=${page}&per_page=${sizePerPage}&sort_column=date&sort_order=D`,
    });

    const { payments, page_context } = output.data;
    res.status(200).json({
      success: true,
      data: {
        rows: payments,
        page: page_context.page,
        sizePerPage: page_context.per_page,
        has_more_page: page_context.has_more_page,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

exports.getPayment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const output = await zohoSubscription.callAPI({
      method: 'GET',
      operation: `payments/${id}`,
    });

    res.status(200).json({
      success: true,
      data: output,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

exports.getAddons = asyncHandler(async (req, res, next) => {
  const { status, page, sizePerPage } = req.query;

  try {
    const output = await zohoSubscription.callAPI({
      method: 'GET',
      operation: `addons?filter_by=AddonStatus.${status}&page=${page}&per_page=${sizePerPage}`,
    });

    const { addons, page_context } = output.data;
    res.status(200).json({
      success: true,
      data: {
        rows: addons,
        page: page_context.page,
        sizePerPage: page_context.per_page,
        has_more_page: page_context.has_more_page,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
