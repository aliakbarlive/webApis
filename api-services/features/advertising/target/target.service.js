const Response = require('@utils/response');

const TargetRepository = require('./target.repository');
const { paginate } = require('@services/pagination.service');

/**
 * List targets by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listTargetsByProfile = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await TargetRepository.findAndCountAllByProfileId(
    profile.advProfileId,
    options
  );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Targets successfully fetched.');
};

module.exports = { listTargetsByProfile };
