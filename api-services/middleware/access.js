const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const { Role } = require('../models');

const { getAccountByIdAndUser } = require('../services/account.service');

const {
  getAdvProfileByAccountIdAndMarketplaceId,
} = require('../services/advProfile.service');

exports.account = asyncHandler(async (req, res, next) => {
  const key = req.method === 'GET' ? 'query' : 'body';
  const { accountId } = req[key];

  const account = await getAccountByIdAndUser(accountId, req.user);

  if (!account) {
    return next(new ErrorResponse('Account Access Forbidden', 403));
  }

  req.account = account;

  next();
});

exports.marketplace = asyncHandler(async (req, res, next) => {
  const key = req.method === 'GET' ? 'query' : 'body';

  const marketplace = req.account.marketplaces.find(
    (marketplace) => marketplace.details.countryCode === req[key].marketplace
  );

  if (!marketplace) {
    return next(new ErrorResponse('Marketplace Access Forbidden', 403));
  }

  req[key]['marketplaceId'] = marketplace.marketplaceId;
  req.marketplace = marketplace;

  next();
});

exports.advProfile = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { marketplaceId } = req.marketplace;

  const advProfile = await getAdvProfileByAccountIdAndMarketplaceId(
    accountId,
    marketplaceId
  );

  if (!advProfile) {
    return next(new ErrorResponse('Advertising Profile Access Forbidden', 403));
  }

  req.advProfile = advProfile;

  next();
});
