const Joi = require('joi');

const { listBaseValidation } = require('./base.validation');

const getInboundShipmentsRequest = {
  query: Joi.object().keys({
    accountId: Joi.string().guid().required(),
    ...listBaseValidation,
    sellerSku: Joi.string(),
    include: Joi.string().valid('items'),
    inboundFBAShipmentStatus: Joi.string().custom((value) => {
      const allowed = [
        'WORKING',
        'SHIPPED',
        'CLOSED',
        'RECEIVING',
        'CANCELLED',
        'DELETED',
        'ERROR',
        'IN_TRANSIT',
        'DELIVERED',
        'CHECKED_IN',
      ];

      const isValid = value
        .split(',')
        .every((attribute) => allowed.includes(attribute));

      if (!isValid) throw new Error('Invalid status.');

      return value;
    }),
  }),
};

const getInboundShipmentRequest = {
  params: Joi.object().keys({
    inboundFBAShipmentId: Joi.string(),
  }),
  query: Joi.object().keys({
    accountId: Joi.string().guid().required(),
    include: Joi.string().valid('items'),
  }),
};

module.exports = { getInboundShipmentRequest, getInboundShipmentsRequest };
