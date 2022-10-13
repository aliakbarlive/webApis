const Joi = require('joi');

const upsellRequest = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
};

const addUpsellRequest = {
  body: Joi.object().keys({
    agencyClientId: Joi.string().guid().required(),
    requestedBy: Joi.string().guid().required(),
    status: Joi.string().valid('draft', 'pending', 'approved', 'rejected'),
    note: Joi.string().allow(null, ''),
    soldBy: Joi.string().guid().allow('', null).default(null),
    commissionAmount: Joi.number().min(0).allow(null),
    details: Joi.array()
      .unique('code')
      .messages({ 'array.unique': 'Duplicate addons are not allowed' })
      .items(
        Joi.object().keys({
          addonId: Joi.string().required(),
          code: Joi.string().required(),
          type: Joi.string().required(),
          name: Joi.string().empty(''),
          description: Joi.string()
            .empty('')
            .regex(/[<>]/, { invert: true })
            .messages({
              'string.pattern.invert.base':
                'Description must not have any (<) less than or (>) greater than symbol',
            }),
          price: Joi.number().messages({
            'number.base': 'item price must be a number',
          }),
          qty: Joi.number().min(1).messages({
            'number.min': 'item quantity must be 1 or more',
            'number.base': 'item quantity must be a number',
          }),
        })
      ),
  }),
};

const updateUpsellRequest = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
  body: Joi.object().keys({
    agencyClientId: Joi.string().guid().required(),
    requestedBy: Joi.string().guid().required(),
    approvedBy: Joi.string().guid().allow('', null),
    soldBy: Joi.string().guid().allow('', null).default(null),
    status: Joi.string().valid('draft', 'pending', 'approved', 'rejected'),
    commissionAmount: Joi.number().min(0).allow(null),
    details: Joi.array()
      .unique('code')
      .messages({ 'array.unique': 'Duplicate addons are not allowed' })
      .items(
        Joi.object().keys({
          upsellDetailId: Joi.number().required().allow('', null),
          upsellId: Joi.string().guid().required(),
          addonId: Joi.string().required(),
          type: Joi.string().required(),
          code: Joi.string().required(),
          name: Joi.string().empty(''),
          description: Joi.string()
            .empty('')
            .regex(/[<>]/, { invert: true })
            .messages({
              'string.pattern.invert.base':
                'Description must not have any (<) less than or (>) greater than symbol',
            }),
          price: Joi.number().messages({
            'number.base': 'item price must be a number',
          }),
          qty: Joi.number().min(1).messages({
            'number.min': 'item quantity must be 1 or more',
            'number.base': 'item quantity must be a number',
          }),
        })
      ),
  }),
};

const deleteUpsellRequest = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
};

const updateUpsellOrderRequest = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
  body: Joi.object().keys({
    upsellId: Joi.string().guid().required(),
    assignedTo: Joi.string().guid().allow('', null),
    status: Joi.string().allow('', null),
    eta: Joi.date().allow('', null),
    startedAt: Joi.date().allow('', null),
    completedAt: Joi.date().allow('', null),
  }),
};

const upsellOrderRequest = {
  body: Joi.object().keys({
    upsellId: Joi.string().guid().required(),
    assignedTo: Joi.string().guid().allow('', null),
    eta: Joi.date().allow('', null),
    startedAt: Joi.date().allow('', null),
    completedAt: Joi.date().allow('', null),
  }),
};

const deleteUpsellOrderRequest = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
};

const upsellItemRequest = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    code: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

const updateUpsellItemRequest = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    code: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

const deleteUpsellItemRequest = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
};

const getUpsellLogRequest = {
  params: Joi.object().keys({
    upsellId: Joi.string().guid().required(),
  }),
};

const addUpsellLogRequest = {
  body: Joi.object().keys({
    upsellId: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const deleteUpsellLogRequest = {
  params: Joi.object().keys({
    upsellId: Joi.string().guid().required(),
    upsellLogId: Joi.string().guid().required(),
  }),
};

const upsellOrderCommentRequest = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
};

const addUpsellOrderCommentRequest = {
  body: Joi.object().keys({
    upsellOrderId: Joi.string().required(),
    comment: Joi.string().required(),
  }),
};

module.exports = {
  upsellRequest,
  updateUpsellRequest,
  addUpsellRequest,
  deleteUpsellRequest,
  upsellItemRequest,
  updateUpsellItemRequest,
  deleteUpsellItemRequest,
  getUpsellLogRequest,
  addUpsellLogRequest,
  deleteUpsellLogRequest,
  upsellOrderCommentRequest,
  addUpsellOrderCommentRequest,
  upsellOrderRequest,
  updateUpsellOrderRequest,
  deleteUpsellOrderRequest,
};
