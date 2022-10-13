const express = require('express');
const router = express.Router();
const os = require('os');
const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });

const { authenticate } = require('@middleware/auth');

const { paginate, withSort } = require('@middleware/advancedList');

const validate = require('@middleware/validate');

const leadValidation = require('./lead.validation');
const leadController = require('./lead.controller');

router.get(
  '/',
  authenticate('leads.view'),
  paginate,
  withSort,
  leadController.listLeads
);

router.get(
  '/overall',
  authenticate('leads.view'),
  leadController.getOverallMetrics
);

router.get(
  '/graph',
  authenticate('leads.view'),
  leadController.getGraphMetrics
);

router.get(
  '/group',
  authenticate('leads.view'),
  leadController.getGroupMetrics
);

router.get(
  '/source',
  authenticate('leads.view'),
  paginate,
  withSort,
  leadController.getLeadSources
);

router.get(
  '/clear-existing-leads',
  authenticate('leads.view'),
  leadController.cleanExistingLeads
);

router.get(
  '/clear-duplicate-leads',
  authenticate('leads.view'),
  leadController.cleanDuplicateLeads
);

router.get(
  '/duplicate',
  authenticate('leads.view'),
  leadController.listLeadsDuplicate
);

router.get('/count', authenticate('leads.view'), leadController.countLeads);

router.post(
  '/',
  // validate(leadValidation.leadRequest),
  authenticate('leads.create'),
  leadController.createLead
);

router.put(
  '/:leadId',
  validate(leadValidation.leadIdParam),
  // validate(leadValidation.leadRequest),
  authenticate('leads.update'),
  leadController.updateLead
);

router.delete(
  '/:leadId',
  validate(leadValidation.leadIdParam),
  authenticate('leads.delete'),
  leadController.deleteLead
);

router.get(
  '/variables',
  authenticate('leads.view'),
  paginate,
  withSort,
  leadController.listLeadsVariables
);

router.post(
  '/variables',
  validate(leadValidation.leadVariableRequest),
  authenticate('leads.view'),
  leadController.createLeadVariable
);

router.put(
  '/variables/:id',
  validate(leadValidation.leadVariableRequest),
  authenticate('leads.view'),
  leadController.updateLeadVariable
);

router.get(
  '/liAccounts',
  authenticate('leads.view'),
  paginate,
  withSort,
  leadController.listLinkedInAccounts
);

router.post(
  '/liAccounts',
  validate(leadValidation.liAccountRequest),
  authenticate('leads.settings.variables.manage'),
  leadController.createliAccount
);

router.put(
  '/liAccounts/:id',
  validate(leadValidation.liAccountRequest),
  authenticate('leads.settings.variables.manage'),
  leadController.updateliAccount
);

router.get(
  '/:leadId',
  validate(leadValidation.leadIdParam),
  authenticate('leads.view'),
  leadController.getLead
);

router.post(
  '/file',
  authenticate('leads.view'),
  upload.single('file'),
  leadController.importCSV
);

router.post(
  '/importleadsfromcsv',
  authenticate('leads.view'),
  upload.single('file'),
  leadController.importLeadsFromCSV
);

router.post(
  '/salesrep',
  authenticate('leads.view'),
  upload.single('file'),
  leadController.importSalesRepresentative
);

router.get(
  '/:leadId/notes',
  authenticate('leads.notes.view'),
  validate(leadValidation.leadIdParam),
  paginate,
  withSort,
  leadController.listLeadNotes
);

router.post(
  '/:leadId/notes',
  validate(leadValidation.leadIdParam),
  validate(leadValidation.leadNoteRequest),
  authenticate('leads.notes.create'),
  leadController.createLeadNote
);

router.get(
  '/:leadId/conversation',
  authenticate('leads.view'),
  validate(leadValidation.leadIdParam),
  leadController.listLeadConversation
);

router.post(
  '/:leadId/conversation',
  validate(leadValidation.leadIdParam),
  authenticate('leads.notes.create'),
  leadController.createLeadConversation
);

router.delete(
  '/notes/:leadNoteId',
  validate(leadValidation.leadNoteIdParam),
  authenticate('leads.notes.delete'),
  leadController.deleteLeadNote
);



module.exports = router;
