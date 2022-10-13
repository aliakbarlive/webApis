const Response = require('@utils/response');

const KeywordRepository = require('./keyword.repository');
const { paginate } = require('@services/pagination.service');

/**
 * List AdGroups by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listKeywordsByProfile = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await KeywordRepository.findAndCountAllByProfileId(
    profile.advProfileId,
    options
  );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Keywords successfully fetched.');
};

module.exports = { listKeywordsByProfile };
