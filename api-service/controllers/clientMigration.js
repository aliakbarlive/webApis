const {
  getByAccountId,
  getZohoUrl,
  sendEmail,
  updateMigrationDetails,
  createOfflineSubscription,
} = require('../services/clientMigrationService');
const { getAccountById } = require('../services/account.service');
const { getUser } = require('../services/user.service');
const { getClient } = require('../services/agencyClient.service');
const asyncHandler = require('../middleware/async');

const startMigration = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    res.status(404).send();
  }

  const cm = await getByAccountId(token);
  if (!cm) {
    res.status(404).send();
  }

  const { accountId, userId, agencyClientId } = cm;
  const account = await getAccountById(accountId);
  const user = await getUser({ userId });
  const { status } = await getClient(agencyClientId);

  let zohoUrl = null;
  if (status === 'registered') {
    zohoUrl = await getZohoUrl(cm);
  }

  if (zohoUrl === 'invalid') {
    return res
      .status(400)
      .send({ message: 'unable to generate link. pls contact administrator' });
  }

  // // Create token
  const jwtToken = user.getSignedJwtToken();

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
  res.status(200).cookie('token', jwtToken, options).json({
    user,
    account,
    status,
    zohoUrl,
  });
};

const updateMigration = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await updateMigrationDetails(id, req.body);

  res.status(200).json({
    success: true,
    id,
    output,
  });
});

const resendEmail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await sendEmail(id, 'resend');

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Create a new zoho offline subscription
// @route    POST /api/v1/agency/subscription/offline
// @access   Private
const addOfflineSubscription = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = createOfflineSubscription(id);

  res.status(200).json({
    success: true,
    output,
  });
});

module.exports = {
  startMigration,
  updateMigration,
  resendEmail,
  addOfflineSubscription,
};
