const Response = require('@utils/response');

const ProfileRepository = require('./profile.repository');
const { AccountRepository } = require('../../account');
const { paginate } = require('@services/pagination.service');

/**
 * List profiles by accountId.
 *
 * @param {uuid} accountId
 * @param {object} options
 * @returns {Promise<Response>} response
 */
const listProfilesByAccountId = async (accountId, options) => {
  const account = await AccountRepository.findByIdWithAdvCredentials(accountId);

  if (!account) {
    return new Response().withCode(400).withMessage('Account not found.');
  }

  const { page, pageSize, pageOffset } = options;

  const apiClient = await account.advApiClient({
    region: 'na',
  });

  let profiles = await apiClient.listProfiles();

  profiles = profiles
    .filter((profile) => profile.accountInfo.type == 'seller')
    .map((profile) => {
      const { dailyBudget, profileId, timezone, accountInfo } = profile;
      return {
        timezone,
        dailyBudget,
        accountId,
        advProfileId: profileId,
        marketplaceId: accountInfo.marketplaceStringId,
      };
    });

  await ProfileRepository.bulkCreate(profiles, {
    updateOnDuplicate: ['dailyBudget'],
  });

  const { rows, count } = await ProfileRepository.findAndCountAllByAccountId(
    accountId,
    options
  );

  return new Response()
    .withData(profiles)
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Profiles successfully fetched.');
};

module.exports = { listProfilesByAccountId };
