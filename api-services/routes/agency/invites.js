const express = require('express');
const { protect, authorize } = require('../../middleware/auth');
const router = express.Router();

const {
  getInvites,
  addInvite,
  getInvite,
  deleteInvite,
  resendInvite,
  getEmployeeInvites,
} = require('../../controllers/agency/invite');
const { paginate } = require('../../middleware/advancedList');

router.get('/', protect, getInvites);
router.post('/', protect, addInvite);
router.get('/employee', protect, paginate, getEmployeeInvites);
router.get('/:id', protect, getInvite);
router.delete('/:id/', protect, deleteInvite);
router.get('/:inviteId/resend', protect, resendInvite);

module.exports = router;
