const asyncHandler = require('../middleware/async');
const {
  Account,
  AccountMarketplace,
  AdvProfile,
  Credential,
  Member,
  InitialSyncStatus,
} = require('../models');

// @desc      Add Account to user.
// @route     POST /api/v1/users/:userId/accounts
// @access    Private
exports.createUserAccount = asyncHandler(async (req, res, next) => {
  const { user } = req.params;
  let { account, marketplaces, credentials, advProfiles } = req.body;
  const { accountId, name, sellingPartnerId, planId, isOnboarding } = account;

  account = await Account.findByPk(accountId);

  if (account && account.sellingPartnerId) {
    res.status(400).json({
      success: false,
      message: 'Account already connected to spApi / advApi.',
    });
  }

  if (account) {
    await account.update({
      name,
      sellingPartnerId,
      planId,
      isOnboarding,
    });
  }

  if (!account) {
    account = await Account.create({
      accountId,
      name,
      sellingPartnerId,
      planId,
      isOnboarding,
    });
  }

  await InitialSyncStatus.findOrCreate({
    where: { accountId },
  });

  await Promise.all(
    marketplaces.map(async (marketplaceId) => {
      await AccountMarketplace.create({
        marketplaceId,
        accountId: account.accountId,
      });
    })
  );

  await Promise.all(
    advProfiles.map(async (advProfile) => {
      await AdvProfile.create({
        ...advProfile,
        accountId: account.accountId,
      });
    })
  );

  await Promise.all(
    credentials.map(async (credential) => {
      await Credential.create({
        ...credential,
        accountId: account.accountId,
      });
    })
  );

  await Member.findOrCreate({
    where: { userId: user.userId, accountId: account.accountId },
    defaults: { roleId: 8 },
  });

  res.status(200).json({
    success: true,
    message: 'Account successfully added to user',
    data: account,
  });
});
