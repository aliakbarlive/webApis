const { groupBy, keys } = require('lodash');
const {
  Account,
  Member,
  Credential,
  Marketplace,
  AccountMarketplace,
  AdvProfile,
  Plan,
  Subscription,
  AgencyClient,
  Role,
  Cell,
  UserGroup,
  User,
  CellClient,
} = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require('../middleware/async');
const { paginate } = require('./pagination.service');

/**
 * Create an account
 * @param {string} planName
 * @param {string} accountName
 * @returns {Promise} Account
 */
const createAccount = async (planName, accountName = 'Unnamed Account') => {
  const { planId } = await Plan.findOne({ where: { name: planName } });

  const account = await Account.create({ name: accountName, planId });

  return account;
};

/**
 * List user accounts
 * @param {uuid} userId
 * @param {string} password
 * @returns {array<Account>}
 */
const listAccountsByUser = asyncHandler(async (user, query) => {
  const { page, pageSize, pageOffset } = query;

  let options = {
    where: {},
    distinct: true,
    include: [
      { model: Plan, as: 'plan', attributes: ['name'] },
      {
        model: AdvProfile,
        as: 'advProfiles',
        attributes: ['advProfileId', 'marketplaceId'],
      },
      {
        model: Credential,
        as: 'credentials',
        attributes: ['service', 'credentialId'],
      },
      {
        model: AgencyClient,
        attributes: ['client','draftMarketplace'],
      },
      {
        model: AccountMarketplace,
        attributes: { exclude: ['accountId'] },
        as: 'marketplaces',
        required: user.role.level === Role.AGENCY_LEVEL,
        include: {
          model: Marketplace,
          attributes: { exclude: ['accountId', 'marketplaceId'] },
          as: 'details',
        },
      },
      { model: Subscription, as: 'subscription' },
    ],
    limit: pageSize,
    offset: pageOffset,
  };

  if (query.search) {
    options.where['name'] = {
      [Op.iLike]: `%${query.search}%`,
    };
  }

  if (
    user.role.level === Role.ACCOUNT_LEVEL ||
    user.role.level === Role.APPLICATION_LEVEL
  ) {
    options.include.push({
      model: Member,
      attributes: [],
      as: 'members',
      where: { userId: user.userId },
      required: true,
    });
  }

  const { level, groupLevel, hasAccessToAllClients } = user.role;

  if (level === Role.AGENCY_LEVEL && groupLevel && !hasAccessToAllClients) {
    let useGroupCondition = { userId: user.userId };

    if (user.memberId !== null) {
      const { squadId, podId, cellId } = user.memberId;

      if (groupLevel === 'squad') useGroupCondition = { squadId };
      if (groupLevel === 'pod') useGroupCondition = { podId };
      if (groupLevel === 'cell') useGroupCondition = { cellId };
    }

    options.include.push({
      model: AgencyClient,
      attributes: ['agencyClientId'],
      required: true,
      include: {
        model: Cell,
        attributes: [],
        required: true,
        as: 'cells',
        include: {
          model: UserGroup,
          attributes: [],
          where: useGroupCondition,
          required: true,
        },
      },
    });
  }

  const { rows, count } = await Account.findAndCountAll(options);

  return paginate(rows, count, page, pageOffset, pageSize);
});

/**
 * Get account by id
 * @param {string} uuid
 * @param {string} accountId
 * @returns {<Account>}
 */
const getAccountById = asyncHandler(async (accountId) => {
  const account = await Account.findByPk(accountId, {
    include: [
      { model: Credential, as: 'credentials', attributes: ['service'] },
      {
        model: AccountMarketplace,
        attributes: { exclude: ['accountId'] },
        as: 'marketplaces',
        include: {
          model: Marketplace,
          attributes: { exclude: ['accountId', 'marketplaceId'] },
          as: 'details',
        },
      },
      { model: Plan, as: 'plan', attributes: ['name'] },
      { model: Subscription, as: 'subscription' },
      { model: AgencyClient, attributes: ['agencyClientId'] },
    ],
  });

  return account;
});

/**
 * Get account by id and UserId
 * @param {string} accountId
 * @param {string} userId
 * @returns {<Account>}
 */
const getAccountByIdAndUserId = asyncHandler(
  async (accountId, userId = null) => {
    const options = {
      where: { accountId },
      include: [
        {
          model: AccountMarketplace,
          attributes: { exclude: ['accountId'] },
          as: 'marketplaces',
          include: {
            model: Marketplace,
            attributes: { exclude: ['accountId', 'marketplaceId'] },
            as: 'details',
          },
        },
      ],
    };

    if (userId) {
      options.include.push({
        model: Member,
        as: 'members',
        required: true,
        attributes: [],
        where: {
          userId,
        },
      });
    }

    const account = await Account.findOne(options);

    return account;
  }
);

/**
 * Get account by id and UserId
 * @param {string} accountId
 * @param {string} userId
 * @returns {<Account>}
 */
const getAccountByIdAndUser = asyncHandler(async (accountId, user) => {
  const options = {
    where: { accountId },
    include: [
      {
        model: AccountMarketplace,
        attributes: { exclude: ['accountId'] },
        as: 'marketplaces',
        include: {
          model: Marketplace,
          attributes: { exclude: ['accountId', 'marketplaceId'] },
          as: 'details',
        },
      },
      {
        model: AgencyClient,
        attributes: ['client'],
      },
      {
        model: Credential,
        as: 'credentials',
        attributes: ['service', 'credentialId'],
      },
      {
        model: AdvProfile,
        as: 'advProfiles',
      },
    ],
  };

  if (
    user.role.level === Role.ACCOUNT_LEVEL ||
    user.role.level === Role.APPLICATION_LEVEL
  ) {
    options.include.push({
      model: Member,
      attributes: [],
      as: 'members',
      where: { userId: user.userId },
      required: true,
    });
  }

  const { level, groupLevel, hasAccessToAllClients } = user.role;

  if (level === Role.AGENCY_LEVEL && !hasAccessToAllClients && groupLevel) {
    let useGroupCondition = { userId: user.userId };

    if (user.memberId !== null) {
      const { squadId, podId, cellId } = user.memberId;

      if (groupLevel === 'squad') useGroupCondition = { squadId };
      if (groupLevel === 'pod') useGroupCondition = { podId };
      if (groupLevel === 'cell') useGroupCondition = { cellId };
    }

    options.include.push({
      model: AgencyClient,
      attributes: [],
      required: true,
      include: {
        model: Cell,
        attributes: [],
        required: true,
        as: 'cells',
        include: {
          model: UserGroup,
          attributes: [],
          where: useGroupCondition,
          required: true,
        },
      },
    });
  }

  const account = await Account.findOne(options);

  return account;
});

/**
 * Get account hosted page details
 * @param {uuid} accountId
 * @param {string} accountId
 * @returns {<Account>}
 */
const getAccountHostedPageDetailsById = async (accountId) => {
  return hostedPageDetails;
};

/**
 * Update account by ID
 * @param {string} uuid
 * @param {string} accountId
 * @param {object} reqBody
 * @returns {<Account>}
 */
const updateAccountById = asyncHandler(async (accountId, reqBody) => {
  await Account.update(reqBody, {
    where: { accountId },
  });

  return getAccountById(accountId);
});

/**
 * Update account marketplace by ID
 * @param {string} accountId
 * @param {string} marketplaceId
 * @param {object} reqBody
 * @returns {<Account>}
 */
const updateAccountMarketplaceById = async (
  accountId,
  marketplaceId,
  userId,
  reqBody
) => {
  if (reqBody.isDefault) {
    await AccountMarketplace.update(
      { isDefault: false },
      { where: { accountId } }
    );
  }

  await AccountMarketplace.update(reqBody, {
    where: { accountId, marketplaceId },
  });

  return getAccountById(accountId, userId);
};

/**
 * Get account by sellingPartnerId
 * @param {string} sellingPartnerId
 * @returns {<Account>}
 */
const getAccountBySellingPartnerId = async (sellingPartnerId) => {
  const account = await Account.findOne({
    where: {
      sellingPartnerId: {
        [Op.eq]: sellingPartnerId,
        [Op.not]: null,
      },
    },
  });

  return account;
};

/**
 * Sync account marketplace.
 * @param {string} accountId
 * @param {array} accountMarketplace
 * @returns {[<Marketplace>]}
 */
const syncAccountMarketplace = async (accountId, accountMarketplace) => {
  let marketplaces = await Marketplace.findAll();

  marketplace = marketplaces.filter((marketplace) =>
    accountMarketplace.find((am) => am.id == marketplace.marketplaceId)
  );

  await Promise.all(
    marketplaces.map(async ({ marketplaceId }) => {
      await AccountMarketplace.upsert({
        accountId,
        marketplaceId,
      });
    })
  );

  return marketplaces;
};

/**
 * Sync account advertising profiles.
 * @param {string} accountId
 * @param {array} profiles
 * @returns {[<AdvProfile>]}
 */
const syncAccountAdvProfiles = async (accountId, profiles) => {
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

  const advProfiles = await AdvProfile.bulkCreate(profiles, {
    updateOnDuplicate: ['dailyBudget'],
  });

  return advProfiles;
};

module.exports = {
  listAccountsByUser,
  getAccountById,
  getAccountBySellingPartnerId,
  getAccountByIdAndUserId,
  getAccountByIdAndUser,
  updateAccountById,
  updateAccountMarketplaceById,
  createAccount,
  syncAccountMarketplace,
  syncAccountAdvProfiles,
};
