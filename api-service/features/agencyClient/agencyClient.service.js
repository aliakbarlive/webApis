const Response = require('@utils/response');

const AgencyClientRepository = require('./AgencyClientRepository');

const { paginate } = require('@services/pagination.service');

const listUnassignedClients = async (options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await AgencyClientRepository.findUnassignedClients(
    options
  );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Unassigned clients successfully fetched.');
};

const findByAccountName = async (client, options = {}) => {
  const agencyClient = await AgencyClientRepository.findOne({
    where: { client },
    ...options,
  });

  return agencyClient;
};

const createCancelledClient = async (body) => {
  await AgencyClientRepository.create(body);
};

module.exports = {
  listUnassignedClients,
  findByAccountName,
  createCancelledClient,
};
