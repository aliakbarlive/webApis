const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const { Account, AccountMarketplace, AdvProfile } = require('../models');
const userService = require('../services/user.service');
const { AGENCY_SUPER_USER } = require('../utils/constants');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ! Most new accounts don't have a role and account in the beginning. This should be a separate middleware if anything. We should only be checking if the user exists in the system for this one.
    // Find user and include accounts and roles.
    // req.user = await User.scope(['withRoles']).findOne({
    //   where: { userId: decoded.id },
    //   include: [
    //     {
    //       model: Account,
    //       as: 'accounts',
    //       attributes: ['accountId', 'name'],
    //       through: { attributes: [] },
    //       include: [
    //         {
    //           model: Marketplace.scope('allowed'),
    //           as: 'marketplaces',
    //           attributes: ['marketplaceId', 'name', 'countryCode'],
    //         },
    //         {
    //           model: AdvProfile,
    //           as: 'advProfiles',
    //           attributes: ['accountId', 'marketplaceId', 'advProfileId'],
    //         },
    //       ],
    //     },
    //   ],
    // });

    // const user = await User.findOne({ where: { userId: decoded.id } });

    const user = await userService.getUser({ userId: decoded.id });

    if (!user) {
      return next(new ErrorResponse('User not found', 401));
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

exports.authenticate =
  (...permissions) =>
  async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token)
      return next(new ErrorResponse('Unauthorized', httpStatus.UNAUTHORIZED));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userService.getUser({ userId: decoded.id });

      if (!user)
        return next(new ErrorResponse('Unauthorized', httpStatus.UNAUTHORIZED));

      if (
        permissions.length &&
        !user.role.permissions.some((p) => permissions.includes(p.access))
      ) {
        return next(new ErrorResponse('Forbidden', httpStatus.FORBIDDEN));
      }

      req.user = user;

      next();
    } catch (error) {
      return next(new ErrorResponse('Unauthorized', httpStatus.UNAUTHORIZED));
    }
  };

exports.authorize = asyncHandler(async (req, res, next) => {
  if (req.user.role.name === AGENCY_SUPER_USER) {
    return next();
  } else {
    return next(
      new ErrorResponse(`User is not authorized to access this route`, 403)
    );
  }
});

// // Grant access to specific roles
// exports.authorize = (...roles) => {
//   return (req, rest, next) => {
//     const check = req.user.roles.map((role) => role.roleName);

//     // grant access if super-admin
//     if (check.includes('super-admin')) {
//       return next();
//     }

//     const found = check.some((r) => roles.indexOf(r) >= 0);
//     if (!found) {
//       return next(
//         new ErrorResponse(`User is not authorized to access this route`, 403)
//       );
//     }
//     next();
//   };
// };

// Grant access to role at specific level
exports.authorizeRoleAt = (level) => (req, rest, next) => {
  const authorizedRoleLevel = level.split(',');

  if (!authorizedRoleLevel.includes(req.user.role.level)) {
    return next(
      new ErrorResponse(`User is not authorized to access this route`, 403)
    );
  }

  next();
};

exports.account = asyncHandler(async (req, res, next) => {
  // Check for Better Seller Account.
  const accountId =
    req.headers['X-BetterSeller-Account'] ??
    req.headers['x-betterseller-account'];

  if (!accountId) {
    return next(
      new ErrorResponse(
        'Please include x-betterseller-account on the request headers',
        403
      )
    );
  }

  const account = await Account.findByPk(accountId, {
    include: [
      {
        model: AccountMarketplace,
        as: 'marketplaces',
        attributes: ['marketplaceId'],
      },
      {
        model: AdvProfile,
        as: 'advProfiles',
        attributes: ['accountId', 'marketplaceId', 'advProfileId'],
      },
    ],
  });

  if (!account) {
    return next(new ErrorResponse('Account does not exist', 403));
  }

  req.account = account;
  next();
});

exports.marketplace = asyncHandler((req, res, next) => {
  const marketplaceId =
    req.headers['X-BetterSeller-Marketplace'] ??
    req.headers['x-betterseller-marketplace'];

  if (marketplaceId) {
    req.marketplace = req.account.marketplaces.find(
      (am) => am.marketplaceId == marketplaceId
    );
  }

  if (!req.marketplace) {
    return next(
      new ErrorResponse(
        'Please include x-betterseller-marketplace on the request headers.',
        403
      )
    );
  }

  // If routes is ppc. Check for advProfile.
  if (req.baseUrl.includes('/ppc')) {
    req.advProfile = req.account.advProfiles.find(
      (advProfile) => advProfile.marketplaceId == marketplaceId
    );

    if (!req.advProfile) {
      return next(new ErrorResponse('Advertising profile does not exist', 403));
    }
  }

  next();
});
