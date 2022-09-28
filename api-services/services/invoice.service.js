const dotenv = require('dotenv');
const zohoSubscription = require('../utils/zohoSubscription');
const sendRawEmail = require('../queues/ses/sendRawEmail');
const { AgencyClient, Invoice, InvoiceItem } = require('../models');
const { addZohoId } = require('./agencyClient.service');
const { compact } = require('lodash');
const { Op } = require('sequelize');

dotenv.config({ path: 'config/config.env' });

/* Custom Views for getting Agency invoices list only */
const invoiceCustomViews = {
  development: {
    All: '2599570000000823044',
    Sent: '2599570000000823036',
    Pending: '2599570000000823004',
    OverDue: '2599570000000823028',
    Paid: '2599570000000823020',
    Unpaid: '2599570000000813041',
    PartiallyPaid: '',
    Void: '',
    Draft: '',
  },
  test: {
    All: '2599570000000823044',
    Sent: '2599570000000823036',
    Pending: '2599570000000823004',
    OverDue: '2599570000000823028',
    Paid: '2599570000000823020',
    Unpaid: '2599570000000813041',
    PartiallyPaid: '',
    Void: '',
    Draft: '',
  },
  production: {
    All: '1604151000004392007',
    Sent: '1604151000004412013',
    Pending: '1604151000004412037',
    OverDue: '1604151000004412045',
    Paid: '1604151000004412053',
    Unpaid: '1604151000004390003',
    PartiallyPaid: '',
    Void: '',
    Draft: '',
  },
};

/**
 * * Get Invoices
 * @param {string}  status: All, Sent, Pending, Draft, OverDue, Paid, PartiallyPaid, Void, Unpaid
 * @param {integer} page
 * @param {integer} sizePerPage
 * @returns {invoices, page_context} {list of invoices, pagination details}
 */
const getInvoices = async (
  status,
  page,
  sizePerPage,
  sort = 'number',
  subscriptionId = null,
  zohoId = null,
  order = 'D'
) => {
  let subscriptionParam = '';
  let zohoIdParam = '';
  if (zohoId === null) {
    subscriptionParam = subscriptionId
      ? `&subscription_id=${subscriptionId}`
      : '';
  } else {
    zohoIdParam = zohoId ? `&customer_id=${zohoId}` : '';
  }
  let customviewParam = invoiceCustomViews[process.env.NODE_ENV][status];

  if (subscriptionId) {
    customviewParam = '';
  }

  const output = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `invoices?${
      customviewParam !== '' ? `customview_id=${customviewParam}&` : ''
    }filter_by=Status.${status}${subscriptionParam}${zohoIdParam}&page=${page}&per_page=${sizePerPage}&sort_column=${sort}&sort_order=${order}`,
  });

  const {
    data: { invoices, page_context },
  } = output;

  return {
    customview: {
      customviewParam,
      status,
    },
    invoices,
    page_context,
  };
};

/**
 * * Get Invoice
 * @param {string} invoiceId
 * @returns {object} invoice details
 */
const getInvoice = async (invoiceId) => {
  const output = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `invoices/${invoiceId}`,
  });

  return output;
};

/**
 * * Get Agency Client from zohoId
 * @param {string} invoiceId
 * @param {string} zohoId
 * @returns {object} agency client
 */
const resolveAgencyClient = async (invoiceId, zohoId) => {
  const output = await AgencyClient.findOne({ where: { zohoId } });

  if (output === null) {
    const { invoice } = await getInvoice(invoiceId);
    const client = await AgencyClient.findOne({
      where: { accountId: invoice.reference_id },
    });

    if (client) {
      await addZohoId(zohoId, client.agencyClientId);
      return client;
    }
    return null;
  }

  return output;
};

/**
 * * Add Invoice Comment
 * @param {string}  invoiceId
 * @param {string} description
 * @returns {object} invoiceComment
 */
const addInvoiceComment = async (invoiceId, description) => {
  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `invoices/${invoiceId}/comments`,
    body: { description },
  });

  return output;
};

/**
 * * Collect Charge
 * @param {string} invoiceId
 * @param {string} cardId
 * @returns {object} Zoho collect charge response
 */
const collectCharge = async (invoice, card) => {
  const res = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `invoices/${invoice.invoice_id}/collect`,
    body: { card_id: card.card_id },
  });

  if (res.code !== 0) {
    await updateCustomField(invoice.invoice_id, 'payment_failure', res.message);

    const message = `A recent payment attempt by ${
      invoice.customer_name
    } for invoice ${invoice.invoice_number} failed. 
    <br>
    <br>
    Please see the reason below:
    <br>
    <br>
    <b>${res.message}</b>
    <br>
    <br>
    To view this invoice, please click the link below:
    <br>
    <br>
    ${`${process.env.AGENCY_URL}/invoices/${invoice.invoice_id}`}
    `;

    await sendRawEmail.add(
      {
        email: [process.env.ZOHO_ADMIN_EMAIL],
        subject: `Invoice ${invoice.invoice_number} - Payment Failure (${invoice.customer_name})`,
        message,
      },
      {
        attempts: 5,
        backoff: 1000 * 60 * 1,
      }
    );
  }

  return res;
};

/**
 * * get cards
 * @param {string} customerId
 * @returns {object} invoice details
 */
const getCards = async (customerId) => {
  const cards = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `customers/${customerId}/cards`,
  });

  return cards;
};

/**
 * * Add/Update Custom Field
 * @param {string} invoiceId
 * @param {string} label
 * @param {string} value
 * @returns {object} Zoho update custom fields response
 */
const updateCustomField = async (invoiceId, label, value) => {
  const res = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `invoices/${invoiceId}/customfields`,
    body: {
      custom_fields: [{ label, value }],
    },
  });

  return res;
};

const voidInvoice = async (invoiceId) => {
  const res = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `invoices/${invoiceId}/void`,
  });
  return res;
};

const convertToOpen = async (invoiceId) => {
  const res = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `invoices/${invoiceId}/converttoopen`,
  });
  return res;
};

const writeoffInvoice = async (invoiceId) => {
  const res = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `invoices/${invoiceId}/writeoff`,
  });
  return res;
};

const cancelWriteoffInvoice = async (invoiceId) => {
  const res = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `invoices/${invoiceId}/cancelwriteoff`,
  });
  return res;
};

const updateInvoiceRecord = async (data) => {
  const invoice = await Invoice.upsert({
    invoiceId: data.invoice_id,
    total: data.total,
    status: data.status,
    balance: data.balance,
    invoiceNumber: data.number,
    createdAt: data.created_time,
    updatedAt: data.updated_time,
    customerId: data.customer_id,
    invoiceDate: data.invoice_date,
    currencyCode: data.currency_code,
    currencySymbol: data.currency_symbol,
    transactionType: data.transaction_type,
    writeOffAmount: data.write_off_amount,
    creditsApplied: data.credits_applied,
    paymentMade: data.payment_made,
    details: data,
  });

  const { invoice_items, invoice_id } = data;
  const itemIds = invoice_items.map((item) => item.item_id);

  const items = invoice_items.map(async (item) => {
    const {
      item_id: invoiceItemId,
      name,
      description,
      code,
      tags,
      item_custom_fields: customFields,
      price,
      quantity,
      discount_amount: discountAmount,
      item_total: itemTotal,
      tax_id: taxId,
      tax_exemption_id: taxExemptionId,
      tax_exemption_code: taxExemptionCode,
    } = item;

    return await InvoiceItem.upsert({
      invoiceItemId,
      invoiceId: invoice_id,
      name,
      description,
      code,
      tags,
      customFields,
      price,
      quantity,
      discountAmount,
      itemTotal,
      taxId,
      taxExemptionId,
      taxExemptionCode,
    });
  });

  await InvoiceItem.destroy({
    where: {
      invoiceItemId: { [Op.notIn]: compact(itemIds) },
      invoiceId: invoice_id,
    },
  });

  return invoice;
};

module.exports = {
  getInvoices,
  getInvoice,
  addInvoiceComment,
  collectCharge,
  getCards,
  updateCustomField,
  resolveAgencyClient,
  voidInvoice,
  convertToOpen,
  writeoffInvoice,
  cancelWriteoffInvoice,
  updateInvoiceRecord,
};
