const Response = require('@utils/response');

const SearchTermRepository = require('./searchTerm.repository');
const { paginate } = require('@services/pagination.service');

/**
 * List search terms by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listSearchTermsByProfile = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await SearchTermRepository.findAndCountAllByProfileId(
    profile.advProfileId,
    options
  );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Keywords successfully fetched.');
};

module.exports = { listSearchTermsByProfile };
