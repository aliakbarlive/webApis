const dotenv = require('dotenv');
const { InvoiceError, Account, AgencyClient } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

dotenv.config({ path: 'config/config.env' });

/**
 * Get all invoices with commission errors
 *
 * @param {string} sort
 * @param {integer} pageSize
 * @param {integer} pageOffset
 * @param {string} status pending | resolved
 * @returns {object} invoice errors including account + agencyclient
 */
const getInvoiceErrors = async ({
  sort,
  pageSize,
  pageOffset,
  status,
  search,
}) => {
  let order = sort;

  if (sort && sort[0].includes('customer_name')) {
    order = [
      [
        { model: Account, as: 'account' },
        { model: AgencyClient },
        'client',
        sort[0][1],
      ],
    ];
  }

  let options = {
    include: [
      {
        model: Account,
        as: 'account',
        attributes: ['accountId'],
        include: {
          model: AgencyClient,
          attributes: ['agencyClientId', 'client'],
        },
      },
    ],
    attributes: { exclude: ['updatedAt'] },
    where: {},
    order,
    limit: pageSize,
    offset: pageOffset,
  };

  if (status) {
    options.where.status = {
      [Op.eq]: status,
    };
  }

  const output = await InvoiceError.findAndCountAll(options);
  return output;
};

/**
 * Get all invoices with commission errors that aren't notified yet
 *
 * @returns {object} invoice errors including account + agencyclient
 */
const getInvoiceErrorsNotNotified = async () => {
  return await InvoiceError.findAndCountAll({
    include: [
      {
        model: Account,
        as: 'account',
        attributes: ['accountId'],
        include: {
          model: AgencyClient,
          attributes: ['agencyClientId', 'client'],
        },
      },
    ],
    where: {
      notifiedAt: {
        [Op.is]: null,
      },
      status: {
        [Op.eq]: 'pending',
      },
    },
  });
};

/**
 * Update all invoices with commission errors that aren't notified yet to notified
 *
 * @returns {promise} invoice error update
 */
const markInvoiceErrorsAsNotified = async () => {
  return await InvoiceError.update(
    { notifiedAt: moment() },
    {
      where: {
        notifiedAt: {
          [Op.is]: null,
        },
        status: {
          [Op.eq]: 'pending',
        },
      },
    }
  );
};

/**
 * Get all invoice errors of an invoice
 *
 * @param {string} invoiceId
 * @returns {object} invoice errors
 */
const getInvoiceErrorsByInvoiceId = async (invoiceId) => {
  return await InvoiceError.findOne({
    where: { invoiceId, status: 'pending' },
  });
};

/**
 * Add an invoice error
 *
 * @param {data} payload invoiceError object
 * @returns {object} invoice errors
 */
const addInvoiceError = async (data) => {
  let invoiceError = await InvoiceError.findOne({
    where: { invoiceId: data.invoiceId },
  });

  if (invoiceError) {
    return await invoiceError.update(data);
  } else {
    return await InvoiceError.create(data);
  }
};

/**
 * Update an invoice error
 *
 * @param {int} invoiceErrorId
 * @param {data} payload invoiceError object
 * @returns {object} invoice errors
 */
const updateInvoiceError = async (invoiceErrorId, data) => {
  return await InvoiceError.update(data, {
    where: { invoiceErrorId },
  });
};

module.exports = {
  getInvoiceErrors,
  getInvoiceErrorsNotNotified,
  markInvoiceErrorsAsNotified,
  addInvoiceError,
  getInvoiceErrorsByInvoiceId,
  updateInvoiceError,
};
