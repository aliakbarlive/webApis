const OptimizationRepository = require('./optimization.repository');

const { paginate } = require('@services/pagination.service');

const Response = require('@utils/response');

const listOptimizationsByProfileId = async (profileId, options = {}) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } =
    await OptimizationRepository.findAndCountAllByProfileId(profileId, options);

  return new Response()
    .withCode(200)
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Optimization items successfully added to queue.');
};

module.exports = { listOptimizationsByProfileId };
