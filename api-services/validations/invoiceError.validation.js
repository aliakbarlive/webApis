const Joi = require('joi');

const addInvoiceErrorRequest = {
  body: Joi.object().keys({
    invoiceId: Joi.string().required(),
    invoiceNumber: Joi.string().required(),
    invoiceDate: Joi.date().required(),
    accountId: Joi.string().guid().required(),
    status: Joi.string().required(),
    description: Joi.string().allow('', null),
  }),
};

const updateInvoiceErrorRequest = {
  params: Joi.object().keys({
    errorId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
  }),
};

module.exports = {
  addInvoiceErrorRequest,
  updateInvoiceErrorRequest,
};
