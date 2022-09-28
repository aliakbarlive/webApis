const Response = require('@utils/response');

const CampaignNegativeKeywordRepository = require('./campaignNegativeKeyword.repository');
const { paginate } = require('@services/pagination.service');

/**
 * List negative keywords by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listCampaignNegativeKeywordsByProfile = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } =
    await CampaignNegativeKeywordRepository.findAndCountAllByProfileId(
      profile.advProfileId,
      options
    );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Campaign negative keywords successfully fetched.');
};

module.exports = { listCampaignNegativeKeywordsByProfile };
