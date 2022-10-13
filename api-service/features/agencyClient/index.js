const AgencyClientRepository = require('./AgencyClientRepository');
const agencyClientRoute = require('./agencyClient.route');
const agencyClientService = require('./agencyClient.service');
const agencyClientController = require('./agencyClient.controller');

module.exports = {
  agencyClientRoute,
  agencyClientService,
  agencyClientController,
  AgencyClientRepository,
};
