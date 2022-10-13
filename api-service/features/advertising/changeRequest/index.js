const ChangeRequestRepository = require('./changeRequest.repository');
const ChangeRequestItemRepository = require('./changeRequestItem.repository');
const changeRequestController = require('./changeRequest.controller');
const changeRequestService = require('./changeRequest.service');
const changeRequestRoute = require('./changeRequest.route');

module.exports = {
  ChangeRequestRepository,
  ChangeRequestItemRepository,
  changeRequestController,
  changeRequestService,
  changeRequestRoute,
};
