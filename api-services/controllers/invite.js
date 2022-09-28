const asyncHandler = require('../middleware/async');
const { Invite } = require('../models');

const inviteService = require('../services/invite.service');
const ErrorResponse = require('../utils/errorResponse');

// * @desc     Get Invite Details
// * @route    GET /api/v1/invites/:inviteToken
// * @access   Private
exports.getInvite = asyncHandler(async (req, res, next) => {
  const { inviteToken } = req.params;

  const invite = await inviteService.getInviteByInviteToken(inviteToken);

  console.log(invite);

  res.status(200).json({
    success: true,
    data: invite,
  });
});

// * @desc     Resend Invite
// * @route    GET /api/v1/invites/:inviteId/resend
// * @access   Private
exports.resendInvite = asyncHandler(async (req, res, next) => {
  const { inviteId } = req.params;

  await inviteService.resendInviteByInviteId(inviteId);

  res.status(200).json({
    success: true,
  });
});
