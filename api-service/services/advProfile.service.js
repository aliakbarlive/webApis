const { AdvProfile } = require('../models');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const getAdvProfileByAccountIdAndMarketplaceId = async (
  accountId,
  marketplaceId
) => {
  const advProfile = await AdvProfile.findOne({
    where: {
      accountId,
      marketplaceId,
    },
  });

  return advProfile;
};

module.exports = {
  getAdvProfileByAccountIdAndMarketplaceId,
};
