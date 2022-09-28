const Response = require('@utils/response');

const AdGroupRepository = require('./adGroup.repository');
const { paginate } = require('../../../services/pagination.service');

/**
 * List AdGroups by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listAdGroupsByProfile = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count, offset } =
    await AdGroupRepository.findAndCountAllByProfileId(
      profile.advProfileId,
      options
    );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('AdGroups successfully fetched.');
};

module.exports = { listAdGroupsByProfile };
