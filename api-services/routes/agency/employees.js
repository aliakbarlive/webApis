const express = require('express');
const { protect } = require('../../middleware/auth');
const router = express.Router();

const {
  getEmployees,
  addEmployee,
  removeEmployee,
  updateEmployeeRole,
  agencyRoles,
  getEmployeesClients,
  getEmployeesDetails,
  getGroups,
  updateGroups,
  deleteGroups,
  getGroupsByLevel,
  getGroupsOptions,
  getEmployeesFilteredByRole,
  getGroupsById,
  getCellEmployees,
  getPodEmployees,
  getSquadEmployees,
  getEmployeesByType,
  getEmployeesFromCellToSquad,
} = require('../../controllers/agency/employees');
const { paginate } = require('../../middleware/advancedList');

router.get('/', protect, paginate, getEmployees);
router.post('/', protect, addEmployee);
router.get('/roles', protect, paginate, agencyRoles);
router.get('/roles/:role', protect, getEmployeesFilteredByRole);
router.get('/clients', protect, paginate, getEmployeesClients);
router.get('/:userId/clients', protect, paginate, getEmployeesDetails);
router.put('/:userId', protect, updateEmployeeRole);
router.delete('/:userId', protect, removeEmployee);

router.get('/groups', protect, getGroups);
router.get('/groupsBy/level', protect, getGroupsByLevel);
router.put('/groups/:level', protect, updateGroups);
router.delete('/groups/:level/:id', protect, deleteGroups);
router.get('/groups/options', protect, getGroupsOptions);
router.get('/groups/:group', protect, getGroupsById);
router.get('/cell/:cellId/employees', protect, getCellEmployees);
router.get('/pod/:podId/employees', protect, getPodEmployees);
router.get('/squad/:squadId/employees', protect, getSquadEmployees);
router.get('/all/:type/:cellId', protect, getEmployeesFromCellToSquad);
router.get('/all/:type', protect, getEmployeesByType);

module.exports = router;
