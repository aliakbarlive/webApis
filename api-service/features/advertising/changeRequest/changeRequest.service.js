const { pick } = require('lodash');

const { paginate } = require('@services/pagination.service');
const { campaignService } = require('../campaign');
const { optimizationBatchService } = require('../optimization');

const ChangeRequestRepository = require('./changeRequest.repository');
const ChangeRequestItemRepository = require('./changeRequestItem.repository');

const Response = require('@utils/response');
const {
  AGENCY_SUPER_USER,
  CHANGE_REQUEST_TYPE_OPTIMIZATION,
  CHANGE_REQUEST_TYPE_UPDATE_CAMPAIGN_MANUALLY,
  CHANGE_REQUEST_TYPE_APPLY_CAMPAIGN_RECOMMENDED_BUDGET,
} = require('@utils/constants');

/**
 * Add Change Request.
 *
 * @param {bigint} profileId
 * @param {uuid} userId
 * @param {string} type
 * @param {string} description
 * @param {array} items
 * @returns {AdvChangeRequest} changeRequest
 */
const addChangeRequest = async (
  profileId,
  userId,
  type,
  description,
  items = []
) => {
  const changeRequest = await ChangeRequestRepository.create(
    {
      type,
      description,
      requestedBy: userId,
      advProfileId: profileId,
      requestedAt: new Date(),
      items: items.map((item) =>
        pick(item, ChangeRequestItemRepository.getAttributes())
      ),
    },
    {
      include: {
        model: ChangeRequestItemRepository.model,
        as: 'items',
      },
    }
  );

  return changeRequest;
};

/**
 * List Change requests submitted by user.
 *
 * @param {User} user
 * @param {object} query
 *
 * @returns {Promise<Response>} result
 */
const listChangeRequestsByUser = async (user, query) => {
  const { page, pageSize, pageOffset } = query;

  if (
    !user.role.permissions.some(
      (p) => p.access === 'ppc.changeRequest.evaluate'
    )
  ) {
    query.filter.requestedBy = user.userId;
  }

  const { level, groupLevel, hasAccessToAllClients } = user.role;

  if (level === 'agency' && !hasAccessToAllClients && groupLevel) {
    query.filter.userId = user.userId;
    if (user.memberId !== null) {
      delete query.filter.userId;
      const { squadId, podId, cellId } = user.memberId;

      if (groupLevel === 'squad') query.filter.squadId = squadId;
      if (groupLevel === 'pod') query.filter.podId = podId;
      if (groupLevel === 'cell') query.filter.cellId = cellId;
    }
  }

  const list = await ChangeRequestRepository.findAndCountAll(query);

  return new Response()
    .withMessage('Successfully fetched change requests.')
    .withData(paginate(list.rows, list.count, page, pageOffset, pageSize));
};

/**
 * Get Change request details.
 *
 * @param {uuid} changeRequestId
 * @param {object} query
 *
 * @returns {Promise<Response>} result
 */
const getChangeRequestDetails = async (changeRequestId, query) => {
  const changeRequest = await ChangeRequestRepository.findById(
    changeRequestId,
    query
  );

  return new Response()
    .withMessage('Successfully fetched change request.')
    .withData(changeRequest);
};

/**
 *
 * @param {User} evaluator
 * @param {uuid} changeRequestId
 * @param {array} itemIds
 * @returns {Promise<Response>} response
 */
const approveChangeRequest = async (evaluator, changeRequestId, itemIds) => {
  const changeRequest = await ChangeRequestRepository.findById(
    changeRequestId,
    { include: ['optimizationBatch', 'advProfile', 'requestor'] }
  );

  if (!changeRequest) {
    return new Response()
      .failed()
      .withCode(404)
      .withMessage('Change Request not found.');
  }

  const items =
    await ChangeRequestItemRepository.findAllPendingByChangeRequestIdAndIds(
      changeRequestId,
      itemIds
    );

  if (items.length !== itemIds.length) {
    return new Response()
      .failed()
      .withCode(400)
      .withMessage('Change Request items invalid.');
  }

  const { type, requestor, advProfile } = changeRequest;

  let response;

  if (
    type === CHANGE_REQUEST_TYPE_UPDATE_CAMPAIGN_MANUALLY ||
    type === CHANGE_REQUEST_TYPE_APPLY_CAMPAIGN_RECOMMENDED_BUDGET
  ) {
    response = await campaignService.processUpdateCampaigns(
      requestor,
      advProfile,
      'sponsoredProducts',
      items.map((item) => item.data)
    );
  }

  if (type === CHANGE_REQUEST_TYPE_OPTIMIZATION) {
    response = await optimizationBatchService.processBatchOptimization(
      changeRequest.optimizationBatch.advOptimizationBatchId,
      items.map((i) => i.advOptimizationId)
    );
  }

  if (response.status) {
    await ChangeRequestItemRepository.updateByIds(itemIds, {
      evaluatedBy: evaluator.userId,
      evaluatedAt: new Date(),
      status: 'approved',
    });
  }

  return response;
};

const rejectChangeRequest = async (evaluator, changeRequestId, itemIds) => {
  const changeRequest = await ChangeRequestRepository.findById(changeRequestId);

  if (!changeRequest) {
    return new Response()
      .failed()
      .withCode(404)
      .withMessage('Change Request not found.');
  }

  const count =
    await ChangeRequestItemRepository.countPendingByChangeRequestIdAndIds(
      changeRequestId,
      itemIds
    );

  if (itemIds.length !== count) {
    return new Response()
      .failed()
      .withCode(400)
      .withMessage('Change Request items invalid.');
  }

  await ChangeRequestItemRepository.updateByIds(itemIds, {
    evaluatedBy: evaluator.userId,
    evaluatedAt: new Date(),
    status: 'rejected',
  });

  return new Response()
    .withData(changeRequest)
    .withMessage('Change request rejected');
};

module.exports = {
  addChangeRequest,
  rejectChangeRequest,
  approveChangeRequest,
  getChangeRequestDetails,
  listChangeRequestsByUser,
};
