const express = require('express');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const router = express.Router();

const { paginate, withSort } = require('../../middleware/advancedList');
const {
  getPermissions,
  addPermissions,
  getRolePermissions,
  getFeatureRoles,
  updateRolePermissions,
} = require('../../controllers/agency/permissions');

// const {
//   addTerminationRequest,
//   updateTerminationRequest,
//   deleteTerminationRequest,
// } = require('../../validations/terminate.validation');

router.get('/', protect, getPermissions);
router.post('/', protect, addPermissions);
router.get('/rolePermissions', protect, getRolePermissions);
router.get('/featureRoles', protect, getFeatureRoles);
router.post('/rolePermissions', protect, updateRolePermissions);

module.exports = router;
