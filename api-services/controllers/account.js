const asyncHandler = require('../middleware/async');
const {
  Account,
  AgencyClient,
  Subscription,
  ClientMigration,
} = require('../models');

const {
  listAccountsByUser,
  getAccountByIdAndUser,
  updateAccountById,
  updateAccountMarketplaceById,
} = require('../services/account.service');
const { getZohoCustomer } = require('../services/client.service');

const {
  getInitialSyncStatusByAccountId,
} = require('../services/initialSyncStatus.service');

const { getMembersByAccountId } = require('../services/member.service');

const ErrorResponse = require('../utils/errorResponse');

// @desc     Get accounts
// @route    GET /api/v1/accounts
// @access   Private
exports.getAccounts = asyncHandler(async (req, res, next) => {
  const accounts = await listAccountsByUser(req.user, req.query);

  res.status(200).json({ success: true, data: accounts });
});

// @desc     Get account
// @route    GET /api/v1/account/:accountId
// @access   Private
exports.getAccount = asyncHandler(async (req, res, next) => {
  const { accountId } = req.params;

  const account = await getAccountByIdAndUser(accountId, req.user);

  if (!account) throw new ErrorResponse('Account not found', 404);

  res.status(200).json({ success: true, data: account });
});

// @desc     Update account
// @route    PUT /api/v1/account/:accountId
// @access   Private
exports.updateAccount = asyncHandler(async (req, res, next) => {
  const { accountId } = req.params;

  const account = await updateAccountById(accountId, req.body);

  res.status(200).json({ success: true, data: account });
});

// @desc     Update account marketplace
// @route    UPDATE /api/v1/account/:accountId/marketplaces/:marketplaceId
// @access   Private
exports.updateAccountMarketplace = asyncHandler(async (req, res, next) => {
  const { userId } = req.user;
  const { accountId, marketplaceId } = req.params;

  const account = await updateAccountMarketplaceById(
    accountId,
    marketplaceId,
    userId,
    req.body
  );

  res.status(200).json({ success: true, data: account });
});

// @desc     Get users under the account
// @route    GET /api/v1/accounts/:accountId/members
// @access   Private
exports.getAccountMembers = asyncHandler(async (req, res, next) => {
  const { accountId } = req.params;
  const { page, pageSize } = req.query;

  const { rows, count } = await getMembersByAccountId(accountId, req.query);

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
    },
  });
});

// @desc     Get Ad group records.
// @route    GET /api/v1/accounts/:accountId/initial-sync-status
// @access   Private
exports.getAccountInitialSyncStatus = asyncHandler(async (req, res, next) => {
  const { accountId } = req.params;

  const details = await getInitialSyncStatusByAccountId(accountId);

  const completedAttrs = Object.keys(details.toJSON()).filter(
    (key) => details[key] == 'COMPLETED'
  );

  const percentage = Math.floor((completedAttrs.length / 9) * 100);

  res.status(200).json({
    success: true,
    data: {
      summary: { percentage, done: percentage == 100 },
      details,
    },
  });
});

// @desc     Get invites under an account
// @route    GET /api/v1/accounts/invites
// @access   Private
exports.getAccountInvites = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;

  const invites = Invite.findAll({
    where: {
      accountId,
    },
  });
});

// * @desc     Get account hosted page details
// * @route    GET v1/accounts/:accountId/hosted-page
// * @access   Private
exports.getAccountHostedPageDetails = asyncHandler(async (req, res, next) => {
  const { accountId } = req.params;

  const output = await AgencyClient.findOne({
    include: [
      {
        model: Account,
        as: 'account',
        where: {
          accountId,
        },
      },
      {
        model: ClientMigration,
        attributes: ['id'],
      },
    ],
  });

  console.log(output);

  const { hostedpageDetails } = output;

  if (!hostedpageDetails) {
    throw new ErrorResponse('Hosted page details not found', 404);
  }

  let zohoCustomer = null;
  if (hostedpageDetails.customer_id && hostedpageDetails.customer_id !== '') {
    const output = await getZohoCustomer(hostedpageDetails.customer_id);
    zohoCustomer = output.customer;
  }

  res.status(200).json({
    success: true,
    data: hostedpageDetails,
    zohoCustomer,
    isMigrate: output.ClientMigration ? output.ClientMigration.id : 0,
  });
});

// * @desc     Get account subscription
// * @route    GET v1/accounts/:accountId/subscription
// * @access   Private
exports.getAccountSubscription = asyncHandler(async (req, res, next) => {
  const { accountId } = req.params;

  const subscription = await Subscription.findOne({
    include: {
      model: Account,
      as: 'account',
      where: {
        accountId,
      },
      attributes: [],
    },
  });

  if (!subscription) {
    throw new ErrorResponse('Subscription not found', 404);
  }

  res.status(200).json({
    success: true,
    data: subscription,
  });
});
