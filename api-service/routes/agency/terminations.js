const express = require('express');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const router = express.Router();

const { paginate, withSort } = require('../../middleware/advancedList');
const {
  addTerminationReport,
  getTerminations,
  getTermination,
  updateTermination,
  deleteTermination,
} = require('../../controllers/agency/terminations');
const {
  addTerminationRequest,
  updateTerminationRequest,
  deleteTerminationRequest,
} = require('../../validations/terminate.validation');

router.get('/', protect, paginate, withSort, getTerminations);
router.post(
  '/',
  validate(addTerminationRequest),
  protect,
  addTerminationReport
);
router.get('/:id', protect, getTermination);
router.put(
  '/:id',
  validate(updateTerminationRequest),
  protect,
  updateTermination
);
router.delete(
  '/:id',
  validate(deleteTerminationRequest),
  protect,
  deleteTermination
);

module.exports = router;
