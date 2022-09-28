const asyncHandler = require('../../middleware/async');
const { Invite, Role } = require('../../models');

const inviteService = require('../../services/invite.service');
const { Op } = require('sequelize');

// @desc     Get All Invites
// @route    GET /api/v1/agency/invite
// @access   Private
exports.getInvites = asyncHandler(async (req, res, next) => {
  const output = await Invite.findAll();

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Get All Employee Invites
// @route    GET /api/v1/agency/invite/employees
// @access   Private
exports.getEmployeeInvites = asyncHandler(async (req, res, next) => {
  const { page, pageSize, pageOffset, sortField, sortOrder } = req.query;
  const { count, rows } = await Invite.findAndCountAll({
    where: {
      accountRoleId: {
        [Op.is]: null,
      },
    },
    include: [
      {
        model: Role,
        as: 'userRole',
        attributes: ['name', 'level'],
      },
    ],
    order: [[sortField, sortOrder]],
    limit: pageSize,
    offset: pageOffset,
  });

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

// @desc     Get Invite Details
// @route    GET /api/v1/agency/invite/{invoiceId}
// @access   Private
exports.getInvite = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await Invite.findByPk(id, { include: 'AgencyClient' });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Add Invite
// @route    POST /api/v1/agency/invite
// @access   Private
exports.addInvite = asyncHandler(async (req, res, next) => {
  const {
    body: { email, agencyClientId, mailInvite },
  } = req;

  const output = await Invite.create({
    email,
    agencyClientId,
  });

  if (mailInvite) {
    output.send();
  }

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Delete Invite
// @route    DELETE /api/v1/agency/invite/{id}
// @access   Private
exports.deleteInvite = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await Invite.destroy({
    where: { inviteId: id },
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Email Invite
// @route    POST /api/v1/agency/invite/{id}/sendemail
// @access   Private
exports.resendInvite = asyncHandler(async (req, res, next) => {
  const { inviteId } = req.params;

  await inviteService.resendInviteByInviteId(inviteId);

  res.status(200).json({
    success: true,
  });
});
