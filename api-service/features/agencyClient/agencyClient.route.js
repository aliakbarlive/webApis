const express = require('express');
const router = express.Router();
const os = require('os');
const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });

const { paginate, withSort } = require('@middleware/advancedList');

const agencyController = require('./agencyClient.controller');

router.get(
  '/unassigned',
  paginate,
  withSort,
  agencyController.listUnassignedClients
);

router.post(
  '/import-cancelled-clients',
  upload.single('file'),
  agencyController.importCancelledClients
);

module.exports = router;
