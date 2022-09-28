const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const SellingPartnerAPI = require('amazon-sp-api');
const AdvertisingClient = require('amazon-ppc-api');
const AmazonApi = require('../utils/amazonApi');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendRawEmail = require('../queues/ses/sendRawEmail');
const path = require('path');
const fs = require('fs');

const {
  User,
  Credential,
  Invite,
  AgencyClient,
  Subscription,
  Plan,
  Account,
  Employee,
  sequelize,
  Role,
  UserGroup,
} = require('../models');

const validator = require('../utils/validator');
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const emailService = require('../services/email.service');
const accountService = require('../services/account.service');
const memberService = require('../services/member.service');

const credentialService = require('../services/credential.service');
const inviteService = require('../services/invite.service');
const roleService = require('../services/role.service');

const agencyOrigins = [
  'http://localhost:3002',
  'http://agency.betterseller.com',
  'https://agency.betterseller.com',
  'http://agency.test.better-seller.betterseller.com',
  'https://agency.test.better-seller.betterseller.com',
];
const appOrigins = [
  'http://localhost:3001',
  'http://app.betterseller.com',
  'https://app.betterseller.com',
  'http://app.test.better-seller.betterseller.com',
  'https://app.test.better-seller.betterseller.com',
];

const systemOrigins = ['http://localhost:3003'];

// * @desc    Login with email and password
// * @route    GET /api/v1/auth/login
// * @access   PRIVATE
const loginWithEmailAndPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const origin = req.get('origin');

  const user = await authService.loginUserWithEmailAndPassword(email, password);

  // * Check if user role and host match
  // if (agencyOrigins.includes(origin) && user.role.level !== 'agency') {
  //   throw new ErrorResponse('Not authorized', 401);
  // } else if (appOrigins.includes(origin) && user.role.level !== 'application') {
  //   throw new ErrorResponse('Not authorized', 401);
  // } else if (systemOrigins.includes(origin) && user.role.level !== 'system') {
  //   throw new ErrorResponse('Not authorized', 401);
  // }

  sendTokenResponse(user, 200, res);
});

// * @desc     Register with email and password
// * @route    GET /api/v1/auth/register/
// * @access   PRIVATE
const registerWithEmailAndPassword = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  await sequelize.transaction(async (t1) => {
    // * Get user role details
    const userRole = await roleService.getRole('user', 'application');

    // * Create user
    const user = await userService.createUser({
      roleId: userRole.roleId,
      firstName,
      lastName,
      email,
      password,
    });

    // * Create account
    const { accountId } = await accountService.createAccount('free');

    // * Get account role details
    const accountRole = await roleService.getRole('owner', 'account');

    // * Create membership between account and user
    await memberService.addUserToAccount(
      user.userId,
      accountId,
      accountRole.roleId
    );

    // * Genereate email verification
    const verifyEmailToken = await user.generateEmailVerificationToken();
    await user.save();

    await emailService.sendVerificationEmail(email, verifyEmailToken);

    sendTokenResponse(user, 200, res);
  });
});

// * @desc     Register with invite token
// * @route    POST /api/v1/auth/register/:inviteToken
// * @access   PRIVATE
const registerWithInviteToken = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const { inviteToken } = req.params;

  await sequelize.transaction(async (t1) => {
    // * Get invite details
    const invite = await inviteService.getInviteByInviteToken(inviteToken);
    // * Get user role details
    const userRole = invite.accountId
      ? await roleService.getRole('user', 'application')
      : await roleService.getRoleById(invite.userRoleId);

    // * Create user
    const user = await userService.createUser({
      roleId: userRole.roleId,
      firstName,
      lastName,
      email,
      password,
      isEmailVerified: true,
    });

    // * If not agencyemployee
    if (invite.accountId) {
      // * Create membership
      await memberService.addUserToAccount(
        user.userId,
        invite.accountId,
        invite.accountRoleId
      );

      // * Check if account is of agency plan
      const plan = await Plan.findOne({
        include: {
          model: Account,
          as: 'accounts',
          where: {
            accountId: invite.accountId,
          },
        },
      });

      // * If account plan is agency, update agency client with default contact ID
      if (plan.name === 'agency') {
        const agencyClient = await AgencyClient.findOne({
          where: {
            accountId: invite.accountId,
          },
        });

        agencyClient.defaultContactId = user.userId;
        agencyClient.status = 'registered';
        await agencyClient.save();
      }
    } else {
      // * process the usergroup
      const { departmentId, squadId, podId, cellId } = invite;
      await UserGroup.create({
        userId: user.userId,
        departmentId,
        squadId,
        podId,
        cellId,
      });
    }

    // * Delete invite
    await invite.destroy();

    // * Send token
    return sendTokenResponse(user, 200, res);
  });
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  const { userId } = req.user;

  if (!token) {
    return next(new ErrorResponse('Invalid verification code', 400));
  }

  const verifyEmailToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    where: {
      userId,
      verifyEmailToken,
      isEmailVerified: false,
    },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid verification code', 400));
  }

  if (user.verifyEmailExpire < Date.now()) {
    return next(
      new ErrorResponse(
        'Your verification code has expired. Please generate a new one.',
        400
      )
    );
  }

  // update confirmed to true
  user.verifyEmailToken = null;
  user.isEmailVerified = true;

  // save
  user.save();

  console.log('Email verified');

  // return token
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  private
 */
const getMe = asyncHandler(async (req, res, next) => {
  const origin = req.get('origin');

  // * Check if user role and host match
  // if (agencyOrigins.includes(origin) && req.user.role.level !== 'agency') {
  //   res.clearCookie('token');
  //   throw new ErrorResponse('Not authorized', 401);
  // } else if (
  //   appOrigins.includes(origin) &&
  //   req.user.role.level !== 'application'
  // ) {
  //   res.clearCookie('token');
  //   throw new ErrorResponse('Not authorized', 401);
  // } else if (
  //   systemOrigins.includes(origin) &&
  //   req.user.role.level !== 'system'
  // ) {
  //   res.clearCookie('token');
  //   throw new ErrorResponse('Not authorized', 401);
  // }

  res.status(200).json({
    success: true,
    data: req.user,
  });
});

const getRoles = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;

  const userRoles = await Employee.findAll({
    attributes: [],
    where: { userId },
    include: {
      attributes: ['name'],
      model: Role,
    },
  });

  res.status(200).json({
    success: true,
    data: userRoles,
  });
});

// Unrefactored
const getMyAgencySubscription = asyncHandler(async (req, res, next) => {
  const agencyClient = await AgencyClient.findOne({
    where: {
      defaultContactId: req.user.userId,
    },
    include: 'Subscription',
  });

  res.status(200).json({
    success: true,
    data: agencyClient,
  });
});

const hasAgencySubscription = asyncHandler(async (req, res, next) => {
  const agencyClient = await AgencyClient.findOne({
    where: {
      defaultContactId: req.user.userId,
    },
  });

  if (agencyClient) {
    const subscription = await Subscription.findOne({
      where: { agencyClientId: agencyClient.agencyClientId },
    });

    res.status(200).json({
      success: subscription ? true : false,
      subscription,
    });
  } else {
    return next(new ErrorResponse('No Agency Client', 400));
  }
});

// @desc      Get Registration Invite Record
// @route     POST /api/v1/auth/register/prefill
// @body      { "id": inviteId }
// @access    Public
const getRegistrationInvite = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  const data = await Invite.scope(['notExpired', 'notApproved']).findByPk(id);
  const { email } = data;

  res.status(200).json({
    success: true,
    email,
  });
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgot-password
// @access    Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  try {
    let filePath = path.join(
      __dirname,
      `../email-templates/forgot-password-en.html`
    );

    let template = fs.readFileSync(
      filePath,
      { encoding: 'utf-8' },
      function (err) {
        console.log(err);
      }
    );

    let message = template
      .replace('{{name}}', user.firstName)
      .replace(
        '{{resetUrl}}',
        `${process.env.SITE_URL}/reset-password/${resetToken}`
      );

    await sendRawEmail.add(
      { email: user.email, subject: 'BetterSeller - Password reset', message },
      {
        attempts: 5,
        backoff: 1000 * 60 * 1,
      }
    );

    res.status(200).json({
      success: true,
      code: 200,
      message: 'Successfully sent reset password email',
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const { password, passwordcheck } = req.body;

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    where: {
      resetPasswordToken,
    },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  if (user.resetPasswordExpire < Date.now()) {
    return next(
      new ErrorResponse(
        'Your password reset token has expired. Please reset your password again.',
        400
      )
    );
  }

  // Set new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Resend Email Verification
// @route     POST /api/v1/auth/verify-email/resend
// @access    Private
const resendEmailVerification = asyncHandler(async (req, res, next) => {
  // Get access to user object
  const { user } = req;
  console.log(user.isEmailVerified);

  // Check if user is already verified
  if (user.isEmailVerified === true) {
    return next(new ErrorResponse('Your account is already verified.', 400));
  }

  // Generate token
  const verifyEmailToken = user.generateEmailVerificationToken();
  console.log('Email verification token generated: ', verifyEmailToken);

  // Update user with generated email token
  await user.save();

  await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  res.status(200).json({
    success: false,
    code: 200,
    message: 'Successfully resent verification code',
  });
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('token', { domain: process.env.DOMAIN, path: '/' });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Amazon Selling Partner API oAuth Callback
// @route     POST /api/v1/auth/selling-partner-api/callback
// @access    Private
const authorizeSPAPI = asyncHandler(async (req, res, next) => {
  const { accountId } = req.account;
  const { state, oAuthCode, sellingPartnerId, redirectUrl } = req.body;

  console.log(redirectUrl);

  if (accountId !== state) return next(new ErrorResponse('Invalid state', 401));

  const sellerPartnerAccount =
    await accountService.getAccountBySellingPartnerId(sellingPartnerId);

  if (sellerPartnerAccount) {
    return next(new ErrorResponse('Account already exists.', 400));
  }

  console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'penv');

  const amazonApi = new AmazonApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  const response = await amazonApi.generateToken(oAuthCode, redirectUrl);

  const spApiClient = new SellingPartnerAPI({
    region: 'na',
    refresh_token: response.refreshToken,
    access_token: response.accessToken,
  });

  const marketplaces = await spApiClient.callAPI({
    operation: 'getMarketplaceParticipations',
  });

  await accountService.syncAccountMarketplace(accountId, marketplaces);

  await credentialService.addCredentialToAccount(accountId, 'spApi', response);

  console.log(response);

  const account = await accountService.updateAccountById(accountId, {
    sellingPartnerId,
  });

  res.status(200).json({ success: true, data: account });
});

// @desc      Amazon Selling Partner API oAuth Callback
// @route     POST /api/v1/auth/advertising-api/callback
// @access    Private
const authorizeAdvAPI = asyncHandler(async (req, res, next) => {
  const { userId } = req.user;
  const { oAuthCode, redirectUrl } = req.body;
  const { accountId } = req.account;

  const amazonApi = new AmazonApi({
    clientId: process.env.ADVERTISING_API_CLIENT_ID,
    clientSecret: process.env.ADVERTISING_API_CLIENT_SECRET,
  });

  const response = await amazonApi.generateToken(oAuthCode, redirectUrl);

  console.log(response);

  const apiClient = new AdvertisingClient({
    clientId: process.env.ADVERTISING_API_CLIENT_ID,
    clientSecret: process.env.ADVERTISING_API_CLIENT_SECRET,
    refreshToken: response.refreshToken,
    accessToken: response.accessToken,
    maxWaitTime: 1000,
    maxRetry: 3,
    sandbox: false,
    region: 'na',
  });

  const profiles = await apiClient.listProfiles();

  await accountService.syncAccountAdvProfiles(accountId, profiles);

  await credentialService.addCredentialToAccount(accountId, 'advApi', response);

  const account = await accountService.getAccountById(accountId, userId);

  res.status(200).json({ success: true, data: account });
});

// @desc      Update authenticated user details.
// @route     PUT /api/v1/auth/me
// @access    Private
const updateProfile = asyncHandler(async (req, res, next) => {
  validator(req.body, {
    firstName: 'required',
    lastName: 'required',
    email: 'required|email',
  });

  const { email } = req.body;
  if (email != req.user.email) {
    const emailExists = await User.findOne({
      attributes: ['email'],
      where: { email },
    });

    if (emailExists) {
      return next(
        new ErrorResponse('Validations failed.', 422, {
          email: ['Email already exists.'],
        })
      );
    }
  }

  const data = await req.user.update(req.body);

  res
    .status(200)
    .json({ status: true, message: 'Profile updated successfully.', data });
});

// @desc      Change user password.
// @route     POST /api/v1/auth/me/change-password
// @access    Private
const changePassword = asyncHandler(async (req, res, next) => {
  validator(req.body, {
    password: 'required',
    newPassword: 'required|min:8',
    confirmPassword: 'required|min:8',
  });

  const { password, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorResponse('Validations failed.', 422, {
        password: ['Password confirmation does not match new password.'],
      })
    );
  }

  const isMatch = await req.user.matchPassword(password);

  if (!isMatch) {
    return next(
      new ErrorResponse('Validations failed.', 422, {
        password: ['The password does not match with current password.'],
      })
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await req.user.update({ password: hashedPassword });

  res
    .status(200)
    .json({ status: true, message: 'Password updated successfully.' });
});

// @desc      Change user password via super admin.
// @route     POST /api/v1/auth/you/change-password
// @access    Private
const changeUserPassword = asyncHandler(async (req, res, next) => {
  validator(req.body, {
    userId: 'required',
    newPassword: 'required|min:8',
    confirmPassword: 'required|min:8',
  });

  const { userId, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorResponse('Validations failed.', 422, {
        password: ['Password confirmation does not match new password.'],
      })
    );
  }

  const user = User.findByPk(userId);

  if (user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.update({ password: hashedPassword }, { where: { userId } });

    res
      .status(200)
      .json({ status: true, message: 'Password updated successfully.' });
  } else {
    res.status(400).json({ status: fales, message: 'Invalid user.' });
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
  };

  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'test'
  ) {
    // options.secure = true;
    options.domain = '.betterseller.com';
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, data: user });
};

module.exports = {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  registerWithInviteToken,
  logout,
  getMe,
  getRoles,
  getMyAgencySubscription,
  hasAgencySubscription,
  getRegistrationInvite,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailVerification,
  authorizeSPAPI,
  authorizeAdvAPI,
  updateProfile,
  changePassword,
  changeUserPassword,
};
