const Joi = require('joi');

const roleRequest = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    level: Joi.string()
      .valid('', 'application', 'agency', 'account', 'system')
      .allow('', null),
    groupLevel: Joi.string().allow('', null),
    allowPerGroup: Joi.number().allow('', null),
    hasAccessToAllClients: Joi.boolean().allow('', null),
    department: Joi.string().allow('', null),
    seniorityLevel: Joi.number().allow('', null),
  }),
};

module.exports = {
  roleRequest,
};
