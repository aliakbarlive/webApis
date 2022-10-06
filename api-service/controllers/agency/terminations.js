const asyncHandler = require('../../middleware/async');
const { Termination } = require('../../models');

const inviteService = require('../../services/invite.service');
const sendRawEmail = require('../../queues/ses/sendRawEmail');
const { Op } = require('sequelize');
const {
  createTerminationReport,
  updateTermination,
  deleteTermination,
  getTerminations,
  getTermination,
} = require('../../services/termination.service');

// @desc     Get All Terminations
// @route    GET /api/v1/agency/termination
// @access   PUBLIC
exports.getTerminations = asyncHandler(async (req, res, next) => {
  const { sort, page, pageSize, pageOffset, search, status } = req.query;

  const { count, rows } = await getTerminations({
    sort,
    page,
    pageSize,
    pageOffset,
    search,
    status,
  });

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
      search,
      status,
    },
  });
});

// @desc     Get Termination Report
// @route    GET /api/v1/agency/termination/:id
// @access   PUBLIC
exports.getTermination = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await getTermination(id);

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Create Termination Report
// @route    POST /api/v1/agency/termination
// @access   Private
exports.addTerminationReport = asyncHandler(async (req, res, next) => {
  const {
    agencyClientId,
    accountManagerId,
    terminationDate,
    seniorAccountManagerId,
    reason,
    moreInformation,
    status,
  } = req.body;

  const output = await createTerminationReport({
    agencyClientId,
    accountManagerId,
    terminationDate,
    seniorAccountManagerId,
    reason,
    moreInformation,
    status,
  });

  res.status(200).json({
    success: true,
    output,
  });
});

// @desc     Update Termination Report
// @route    PUT /api/v1/agency/termination/:id
// @access   Private
exports.updateTermination = asyncHandler(async (req, res, next) => {
  const {
    accountManagerId,
    terminationDate,
    seniorAccountManagerId,
    reason,
    moreInformation,
    status,
  } = req.body;
  const { id } = req.params;

  const output = await updateTermination(
    {
      accountManagerId,
      terminationDate,
      seniorAccountManagerId,
      reason,
      moreInformation,
      status,
    },
    id
  );

  res.status(200).json({
    success: true,
    output,
  });
});

exports.deleteTermination = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const output = await deleteTermination(id);

  res.status(200).json({
    success: true,
    output,
  });
});
