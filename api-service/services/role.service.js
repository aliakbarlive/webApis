const { Op } = require('sequelize');
const { Role } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

/**
 * * Get role by name
 * @param {string} name
 * @returns {object} Role
 */
const getRoleByName = async (name) => {
  const role = await Role.findOne({ where: { name } });

  return role;
};

/**
 * * Get role by roleId
 * @param {string} roleId
 * @returns {object} Role
 */
const getRoleById = async (roleId) => {
  const role = await Role.findByPk(roleId);

  return role;
};

/**
 * * Get role
 * @param {string} name
 * @param {string} level
 * @returns {object} Role
 */
const getRole = async (name, level) => {
  const role = await Role.findOne({ where: { name, level } });

  if (!role) {
    throw new ErrorResponse('Role not found', 404);
  }

  return role;
};

/**
 * * Add role to user
 * @param {uuid} userId
 * @param {integer} roleId
 * @returns {object} UserRole
 */
const addRoleToUser = async (userId, roleId) => {
  const userRole = await UserRole.create({ userId, roleId });

  return userRole;
};

/**
 * * get Role Ids based by name
 * @param {array} roleNames
 * @returns {array} roleIds
 */
const getRoleIds = async (names) => {
  const roles = await Role.findAll({
    attributes: ['roleId'],
    where: { name: { [Op.in]: names } },
  });

  return roles.map((role) => role.roleId);
};

module.exports = {
  getRole,
  getRoleByName,
  getRoleById,
  addRoleToUser,
  getRoleIds,
};
