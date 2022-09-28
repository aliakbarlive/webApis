const Joi = require('joi');
const { listBaseValidation } = require('./base.validation');

const addTerminationRequest = {
  body: Joi.object().keys({
    agencyClientId: Joi.string().guid().required(),
    accountManagerId: Joi.string().guid().required(),
    terminationDate: Joi.date().required(),
    // terminationDateMm: Joi.string(),
    // terminationDateDd: Joi.string(),
    // terminationDateYy: Joi.string(),
    seniorAccountManagerId: Joi.string().guid().required(),
    reason: Joi.string().required(),
    moreInformation: Joi.string().allow('', null),
    status: Joi.string().valid('pending', 'approved', 'cancelled'),
  }),
};

const updateTerminationRequest = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    agencyClientId: Joi.string().guid().required(),
    accountManagerId: Joi.string().guid().required(),
    terminationDate: Joi.date().required(),
    seniorAccountManagerId: Joi.string().guid().required(),
    reason: Joi.string().required(),
    moreInformation: Joi.string().allow('', null),
    status: Joi.string().valid('pending', 'approved', 'cancelled'),
  }),
};

const deleteTerminationRequest = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  addTerminationRequest,
  updateTerminationRequest,
  deleteTerminationRequest,
};
