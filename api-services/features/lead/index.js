const leadRoute = require('./lead.route');
const leadService = require('./lead.service');
const leadValidation = require('./lead.validation');
const leadController = require('./lead.controller');
const leadRepository = require('./lead.repository');

module.exports = {
  leadRoute,
  leadService,
  leadValidation,
  leadController,
  leadRepository,
};
