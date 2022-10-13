const Joi = require('joi');

const entityTypeRequest = {
  body: Joi.object().keys({
    entity: Joi.string().required(),
    i18nAttribute: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const addNotificationRequest = {
  body: Joi.object().keys({
    entityTypeId: Joi.number().allow('', null),
    entityId: Joi.string().required(),
    status: Joi.string().required(),
    recipientIds: Joi.array().allow(null),
  }),
};

module.exports = {
  entityTypeRequest,
  addNotificationRequest,
};
