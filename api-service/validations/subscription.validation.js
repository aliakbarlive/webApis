const Joi = require('joi');
const { listBaseValidation } = require('./base.validation');

const updatePlanDescriptionRequest = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().required(),
    planCode: Joi.string().required(),
  }),
  body: Joi.object().keys({
    description: Joi.string()
      .allow('', null)
      .regex(/[<>]/, { invert: true })
      .messages({
        'string.pattern.invert.base':
          'Description must not have any (<) less than or (>) greater than symbol',
      }),
  }),
};

const noteRequest = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    description: Joi.string()
      .empty('')
      .regex(/[<>]/, { invert: true })
      .messages({
        'string.pattern.invert.base':
          'Note must not have any (<) less than or (>) greater than symbol',
      }),
  }),
};

const updateSubscriptionRequest = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    addons: Joi.array()
      .unique('addon_code')
      .messages({ 'array.unique': 'Duplicate addons are not allowed' })
      .items(
        Joi.object().keys({
          addon_code: Joi.string().required().messages({
            required: 'Addon code is not allowed to be empty',
          }),
          addon_description: Joi.string().max(2000).empty(''),
          name: Joi.string().empty(''),
          price: Joi.number().messages({
            'number.base': 'Addon price must be a number',
          }),
          quantity: Joi.number().min(1).messages({
            'number.min': 'Addon quantity must be 1 or more',
            'number.base': 'Addon quantity must be a number',
          }),
          type: Joi.string().valid('one_time', 'recurring'),
        })
      ),
    apply_changes: Joi.string().required(),
    auto_collect: Joi.boolean(),
    card_id: Joi.string().empty(''),
    plan_code: Joi.string().required(),
    plan_description: Joi.string()
      .max(2000)
      .allow('')
      .regex(/[<>]/, { invert: true })
      .messages({
        'string.pattern.invert.base':
          'Description must not have any (<) less than or (>) greater than symbol',
      }),
    price: Joi.number().required(),
  }),
};

module.exports = {
  updatePlanDescriptionRequest,
  noteRequest,
  updateSubscriptionRequest,
};
