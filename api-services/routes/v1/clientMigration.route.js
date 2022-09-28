const express = require('express');
const router = express.Router();
const {
  startMigration,
  updateMigration,
  resendEmail,
  addOfflineSubscription,
} = require('../../controllers/clientMigration');
const { protect } = require('../../middleware/auth');

router.get('/:token', startMigration);
router.post('/:id/update', protect, updateMigration);
router.get('/:id/resend', protect, resendEmail);
router.post('/:id/offline', protect, addOfflineSubscription);

module.exports = router;
