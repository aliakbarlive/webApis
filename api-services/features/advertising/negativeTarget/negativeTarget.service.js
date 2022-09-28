const Response = require('@utils/response');

const NegativeTargetRepository = require('./negativeTarget.repository');
const { paginate } = require('@services/pagination.service');

/**
 * List negative targets by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listNegativeTargetsByProfile = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } =
    await NegativeTargetRepository.findAndCountAllByProfileId(
      profile.advProfileId,
      options
    );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Negative targets successfully fetched.');
};

module.exports = { listNegativeTargetsByProfile };
