const { Invite, Role } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const sendRawEmailQueue = require('../queues/ses/sendRawEmail');
const sendHtmlEmailQueue = require('../queues/ses/sendEmail');
const crypto = require('crypto');
const moment = require('moment');

/**
 * * Generate invite token
 */
const generateInviteToken = async () => {
  // * Generate token
  const token = await crypto.randomBytes(10).toString('hex');

  // * Hash token
  const hashedToken = await crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return hashedToken;
};

/**
 * * Create invite
 * @param {string} email
 * @param {string} userRoleId
 * @param {uuid} acountId
 * @param {uuid} accountRoleId
 * @returns {Promise<User>}
 */
const createInvite = async (
  email,
  userRoleId,
  accountId,
  accountRoleId,
  userGroup = {
    isPpc: null,
    departmentId: null,
    squadId: null,
    podId: null,
    cellId: null,
  }
) => {
  // * Initialize invite query
  const query = { email };

  // * Check if there is already an existing invite for an email and accountId combination as there should only be 1 invite per email per account
  if (accountId) {
    query.accountId = accountId;
  }

  // * Check if there is an existing invite for a
  if (!accountId) {
    query.userRoleId = userRoleId;
  }

  // * Check if invite already exists
  const existingInvite = await Invite.findOne({
    where: query,
  });

  if (existingInvite) {
    throw new ErrorResponse('Invite already exist.', 409);
  }

  // * Generate invite token
  const inviteToken = await generateInviteToken();

  // * Prepare the user group
  const { isPpc, departmentId, squadId, podId, cellId } = userGroup;

  // * Create invite
  await Invite.create({
    email,
    userRoleId,
    accountId,
    accountRoleId,
    inviteToken,
    inviteExpire: new Date(Date.now() + 48 * (60 * 60 * 1000)),
    isPpc,
    departmentId,
    squadId,
    podId,
    cellId,
  });

  // * Send invite via email
  await sendInvite(email, inviteToken, accountId ? false : true);
};

/**
 * * Get invite
 * @param {string} inviteToken
 * @returns {Promise<User>}
 */
const getInviteByInviteToken = async (inviteToken) => {
  const invite = await Invite.findOne({ where: { inviteToken } });

  // * Check if invite exist
  if (!invite) {
    throw new ErrorResponse('Invite not found', 404);
  }

  // * Check if invite is expired
  // if (moment().isAfter(invite.inviteExpire)) {
  //   throw new ErrorResponse('Invite expired', 404);
  // }

  return invite;
};

/**
 * Send invite
 * @param {string} firstName
 * @param {string} email
 * @param {string} inviteToken
 */
const sendInvite = async (email, inviteToken, isEmployee) => {
  const language = 'en'; // default to english for now, but could be from user's preference in the future
  let template = isEmployee
    ? 'employee-invite-template'
    : process.env.ACCOUNT_INVITE_TEMPLATE?.replace('{language}', language);

  let templateData = JSON.stringify(
    isEmployee
      ? {
          name: email,
          inviteLink: `${process.env.AGENCY_URL}/register/${inviteToken}`,
        }
      : {
          inviteLink: `${process.env.SITE_URL}/register/${inviteToken}`,
        }
  );

  if (!template) {
    console.log('No defined template in .env file (ACCOUNT_INVITE_TEMPLATE).');
    return;
  }

  await sendHtmlEmailQueue.add(
    {
      email,
      bcc: process.env.NOTIFICATIONS_EMAIL,
      template,
      templateData,
    },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );
};

/**
 * Resend invite
 * @param {uuid} inviteId
 * @returns {Promise<User>}
 */
const resendInviteByInviteId = async (inviteId) => {
  // * Find invite
  const invite = await Invite.findByPk(inviteId);

  // *  Check if invite exists
  if (!invite) {
    throw new ErrorResponse('Invite not found', 401);
  }

  // * Generate new invite token
  const inviteToken = await generateInviteToken();

  // * Update invite details
  invite.inviteToken = inviteToken;
  invite.inviteExpire = new Date(Date.now() + 4380 * (60 * 60 * 1000));
  await invite.save();

  const isEmployee = invite.accountRoleId ? false : true;

  // * Send new invite token via email
  await sendInvite(invite.email, inviteToken, isEmployee);
};

/**
 * Update invited email
 * @param {uuid} inviteId
 */
const updateInvitedEmail = async (accountId, email) => {
  const invite = await Invite.findOne({ where: { accountId } });

  if (!invite) {
    throw new ErrorResponse('Invite not found', 404);
  }

  invite.email = email;
  await invite.save();
};

module.exports = {
  createInvite,
  getInviteByInviteToken,
  sendInvite,
  resendInviteByInviteId,
  generateInviteToken,
  updateInvitedEmail,
};
