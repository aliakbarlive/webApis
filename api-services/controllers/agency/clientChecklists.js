const asyncHandler = require('../../middleware/async');
const { pick, keys } = require('lodash');
const sendRawEmail = require('../../queues/ses/sendRawEmail');

const { ClientChecklist, Log, Checklist } = require('../../models');
const {
  getChecklistByClientId,
  updateChecklistByClientId,
  updateChecklistService,
  getClientChecklistById,
  getChecklistById,
  updateChecklistById,
} = require('../../services/agencyClient.service');

const { saveLog } = require('../../services/log.service');

// * @desc     Get all checklist by client id
// * @route    GET /api/v1/agency/client/:agencyClientId/checklists/:checklistId
// * @access   Private
exports.getChecklistByClientId = asyncHandler(async (req, res, next) => {
  const { agencyClientId, checklistId } = req.params;
  const data = await getChecklistByClientId(agencyClientId, checklistId);

  res.status(200).json({
    success: true,
    data,
  });
});



// * @desc     Get single client checklist
// * @route    GET /api/v1/agency/client/checklists/:clientChecklistId
// * @access   Private
exports.getClientChecklistById = asyncHandler(async (req, res, next) => {
  const { clientChecklistId } = req.params;
  const data = await getClientChecklistById(clientChecklistId);
  res.status(200).json({
    success: true,
    data,
  });
});

// * @desc     Get all checklist by client id
// * @route    POST /api/v1/agency/client/:agencyClientId/checklists
// * @access   Private
exports.updateChecklistByClientId = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;
  const { checklistId } = req.body;

  const payload = {
    agencyClientId,
    ...pick(req.body, keys(ClientChecklist.rawAttributes)),
  };

  const data = await updateChecklistByClientId(
    agencyClientId,
    checklistId,
    payload
  );

  res.status(200).json({
    success: true,
    data,
  });
});

// * @desc     Update checklist defaultValue
// * @route    POST /api/v1/agency/client/:agencyClientId/checklists/default-value
// * @access   Private
exports.updateChecklistDefaultValue = asyncHandler(async (req, res, next) => {
  const { agencyClientId } = req.params;
  const { checklistId } = req.body;

  const payload = {
    agencyClientId,
    ...pick(req.body, keys(Checklist.rawAttributes)),
  };

  const data = await updateChecklistService(checklistId, payload.defaultValue);

  res.status(200).json({
    success: true,
    data: data,
  });
});

// * @desc     Get all logs from a specific checklist from an agency client
// * @route    GET /api/v1/agency/client/checklists/:clientChecklistId/logs
// * @access   Private
exports.getLogsByChecklist = asyncHandler(async (req, res, next) => {
  const { clientChecklistId } = req.params;

  const data = await Log.findAll({
    attributes: ['logId', 'name', 'createdAt'],
    include: {
      model: ClientChecklist,
      attributes: [],
      where: {
        clientChecklistId,
      },
    },
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    success: true,
    data,
  });
});

// * @desc     Get all logs from a specific client checklist id
// * @route    POST /api/v1/agency/client/checklists/:clientChecklistId/logs
// * @access   Private
exports.saveLogByChecklist = asyncHandler(async (req, res, next) => {
  const { clientChecklistId } = req.params;
  const { name } = req.body;

  // * save the log related to the checklist
  const data = await saveLog({
    logType: 'clientChecklist',
    referenceId: clientChecklistId,
    name,
    message: '',
    status: 'info',
  });

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Send email
// @route    POST /api/v1/agency/client/send-email
// @access   Private
exports.sendEmail = asyncHandler(async (req, res, next) => {
  const { to, cc, subject, message } = req.body;
  await sendRawEmail.add(
    {
      email: to.split(',').filter((e) => e !== ''),
      cc: cc ? cc.split(',').filter((e) => e !== '') : [],
      subject: subject ? subject : 'No subject',
      message,
    },
    {
      attempts: 5,
      backoff: 1000 * 60 * 1,
    }
  );

  res.status(200).json({
    success: true,
    message: 'Email Sent',
  });
});

// @desc     Get Checklist By ID
// @route    GET /api/v1/agency/client/checklist/:checklistId
// @access   Private
exports.getChecklistById = asyncHandler(async (req, res, next) => {
  const { checklistId } = req.params;

  const data = await getChecklistById(checklistId);
  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Update Checklist By ID
// @route    POST /api/v1/agency/client/checklist/:checklistId
// @access   Private
exports.updateChecklistById = asyncHandler(async (req, res, next) => {
  const { checklistId } = req.params;

  const payload = {
    ...pick(req.body, keys(Checklist.rawAttributes)),
  };

  await updateChecklistById({ checklistId, payload });

  res.status(200).json({
    success: true,
  });
});
