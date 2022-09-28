const express = require('express');
const { protect, authorize } = require('../../middleware/auth');
const router = express.Router();

const os = require('os');

const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });

const {
  addClient,
  getClients,
  getClient,
  updateClient,
  updateExistingClient,
  getClientInvite,
  getClientEmployees,
  addClientEmployee,
  deleteClientEmployee,
  storeCycleDates,
  updateCycleDate,
  getInvoiceEmails,
  saveInvoiceEmails,
  getCells,
  saveCells,
  getZohoCustomers,
  getZohoCustomer,
  getClientsByPodId,
  processCSVFile,
  getClientByAccountId,
  checkDefaultContactEmail,
  assignExistingContact,
  createNewDefaultContact,
  updateZohoDefaultContact,
  deleteClient,
  addAgencyClientLog,
  getAgencyClientLogs,
  updateNoCommission,
} = require('../../controllers/agency/client');

const {
  getChecklistByClientId,
  updateChecklistByClientId,
  updateChecklistDefaultValue,
  getLogsByChecklist,
  saveLogByChecklist,
  sendEmail,
  getClientChecklistById,
  getChecklistById,
  updateChecklistById,
} = require('../../controllers/agency/clientChecklists');

const validate = require('../../middleware/validate');
const { paginate, withSort } = require('../../middleware/advancedList');
const { postAgencyClientToSI } = require('../../controllers/agency/siWebhooks');
const {
  getAgencyClientsListRequest,
  getAgencyClientRequest,
  addAgencyClientRequest,
  agencyClientRequest,
  updateExistingClientRequest,
} = require('../../validations/agencyClient.validation');

router.post('/check-contact-email', protect, checkDefaultContactEmail);
router.post(
  '/:agencyClientId/assign-existing-contact',
  protect,
  assignExistingContact
);
router.post(
  '/:agencyClientId/create-default-contact',
  protect,
  createNewDefaultContact
);
router.post('/update-zoho-default-contact', protect, updateZohoDefaultContact);

router.post('/file', protect, upload.single('file'), processCSVFile);
router.get('/store-cycle-dates', protect, storeCycleDates);
router.get('/:agencyClientId/store-cycle-dates', protect, storeCycleDates);
router.post('/:agencyClientId/store-cycle-dates', protect, updateCycleDate);

router.get(
  '/',
  validate(getAgencyClientsListRequest),
  protect,
  paginate,
  withSort,
  getClients
);
router.post('/', validate(agencyClientRequest), protect, addClient);
router.get('/:id', validate(getAgencyClientRequest), protect, getClient);
router.put('/:id', validate(agencyClientRequest), protect, updateClient);
router.delete(
  '/:id',
  validate(getAgencyClientRequest),
  protect,
  authorize,
  deleteClient
);
router.patch(
  '/:id',
  validate(updateExistingClientRequest),
  protect,
  updateExistingClient
);

router.get('/account/:id', protect, getClientByAccountId);
router.get('/zoho', protect, getZohoCustomers);
router.get('/zoho/:id', protect, getZohoCustomer);

router.post('/wh', protect, postAgencyClientToSI);

router.get('/:agencyClientId/invite', getClientInvite);

router.get('/:agencyClientId/employees', protect, paginate, getClientEmployees);
router.post('/:agencyClientId/employees', addClientEmployee);
router.delete('/:agencyClientId/employees/:userId', deleteClientEmployee);

// Checklist
router.get('/checklist/:checklistId', protect, getChecklistById);
router.post('/checklist/:checklistId', protect, updateChecklistById);
router.get('/checklists/:clientChecklistId/logs', protect, getLogsByChecklist);
router.post('/checklists/:clientChecklistId/logs', protect, saveLogByChecklist);
router.get('/checklists/:clientChecklistId', protect, getClientChecklistById);
router.get('/:agencyClientId/checklists', protect, getChecklistByClientId);
router.post('/:agencyClientId/checklists', protect, updateChecklistByClientId);
router.post(
  '/:agencyClientId/checklists/default-value',
  protect,
  updateChecklistDefaultValue
);
router.get(
  '/:agencyClientId/checklists/:checklistId',
  protect,
  getChecklistByClientId
);

router.post('/:agencyClientId/send-email', protect, sendEmail);

router.get('/:agencyClientId/invoice-emails', protect, getInvoiceEmails);
router.post('/:agencyClientId/invoice-emails', protect, saveInvoiceEmails);

router.get('/:agencyClientId/cells', protect, getCells);
router.post('/:agencyClientId/cells', protect, saveCells);
router.get('/:agencyClientId/log', protect, paginate, getAgencyClientLogs);
router.post('/:agencyClientId/log', protect, addAgencyClientLog);

router.get('/pod/:podId', protect, getClientsByPodId);

router.post('/:agencyClientId/nocommission', protect, updateNoCommission);

module.exports = router;
