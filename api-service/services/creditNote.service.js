const zohoSubscription = require('../utils/zohoSubscription');
const { CreditNote, AgencyClient, User, UserGroup } = require('../models');
const { Op } = require('sequelize');
/**
 * Create a credit note for a customer
 * @param {Object} body
 * @returns Object
 */
const createNote = async (body) => {
  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `creditnotes`,
    body,
  });
  return output.data ? output.data : {};
};

/**
 * Retrive a credit note
 * @param {String} noteId
 * @returns Object
 */
const retrieveNote = async (noteId) => {
  const zoho = await zohoSubscription.callAPI({
    method: 'GET',
    operation: `creditnotes/${noteId}`,
  });
  return zoho.message == 'success' ? zoho.creditnote : {};
};

/**
 * Email credit note to recepient
 * @param {String} noteId
 * @returns Object
 */
const emailNote = async (noteId, body) => {
  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `creditnotes/${noteId}/email`,
    body,
  });
  return output.data ? output.data : {};
};

/**
 * Apply to Credit note to invoice
 * @param {String} noteId
 * @param {Object} body
 * @returns Object
 */
const applyToInvoice = async (noteId, body) => {
  const output = await zohoSubscription.callAPI({
    method: 'POST',
    operation: `creditnotes/${noteId}/invoices`,
    body,
  });
  return output.data ? output.data : {};
};

/**
 * Retrive the list of credit note request
 * @param {Object} query
 * @returns Object
 */
const getCreditNoteRequests = async (query) => {
  const { pageSize, pageOffset, sortField, sortOrder, customers, status } =
    query;

  const attributes = ['name', 'price', 'dateApplied', 'status'];

  const options = {
    include: [
      {
        attributes: ['client'],
        model: AgencyClient,
      },
      {
        attributes: ['firstName', 'lastName'],
        as: 'requestor',
        model: User,
      },
      {
        attributes: ['firstName', 'lastName'],
        as: 'approved',
        model: User,
      },
      {
        attributes: ['departmentId', 'squadId', 'podId', 'cellId'],
        as: 'group',
        model: UserGroup,
      },
    ],
    limit: pageSize,
    offset: pageOffset,
    where: {},
  };

  if (sortField && sortOrder && attributes.includes(sortField)) {
    options.order = [[sortField, sortOrder]];
  }

  if (customers) {
    options.where.customerId = {
      [Op.in]: customers,
    };
  }
  if (status) {
    options.where.status = status;
  }
  const { count, rows } = await CreditNote.findAndCountAll(options);

  return { count, rows };
};

module.exports = {
  createNote,
  retrieveNote,
  emailNote,
  applyToInvoice,
  getCreditNoteRequests,
};
