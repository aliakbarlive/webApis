const express = require('express');

// Middlewares
const validate = require('../../middleware/validate');

// Controllers
const { getInvite, resendInvite } = require('../../controllers/invite');

const router = express.Router();

router.get('/:inviteToken', getInvite);
router.get('/:inviteId/resend', resendInvite);

module.exports = router;
