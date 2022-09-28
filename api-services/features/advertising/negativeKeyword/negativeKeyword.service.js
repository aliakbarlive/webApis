const Response = require('@utils/response');

const NegativeKeywordRepository = require('./negativeKeyword.repository');
const { paginate } = require('@services/pagination.service');

/**
 * List negative keywords by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listNegativeKeywordsByProfile = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } =
    await NegativeKeywordRepository.findAndCountAllByProfileId(
      profile.advProfileId,
      options
    );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Negative keywords successfully fetched.');
};

module.exports = { listNegativeKeywordsByProfile };
