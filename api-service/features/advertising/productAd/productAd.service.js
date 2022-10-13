const Response = require('@utils/response');

const ProductAdRepository = require('./productAd.repository');
const { paginate } = require('@services/pagination.service');

/**
 * List products by profile.
 *
 * @param {AdvProfile} profile
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listProductsByProfile = async (profile, options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await ProductAdRepository.findAndCountAllByProfileId(
    profile.advProfileId,
    options
  );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Products successfully fetched.');
};

module.exports = { listProductsByProfile };
