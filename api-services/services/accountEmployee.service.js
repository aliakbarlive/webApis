const { AccountEmployee, User, Role } = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const userService = require('./user.service');

/**
 * Get employees associated to an agency client's account
 * @param {uuid} accountId
 * @param {integer} pageSize
 * @param {integer} pageOffset
 * @param {string} sortField
 * @param {string} sortOrder
 * @returns {Promise} AccountEmployee
 */
const getEmployees = async (
  accountId,
  pageSize,
  pageOffset,
  sortField,
  sortOrder
) => {
  const userAttributes = ['userId', 'firstName', 'lastName', 'email'];
  const roleAttributes = ['name', 'level'];

  const query = {
    attributes: userAttributes,
    include: [
      {
        model: AccountEmployee,
        as: 'employees',
        attributes: [],
        where: { accountId },
      },
      { model: Role, as: 'role', attributes: roleAttributes },
    ],
  };

  if (pageSize) {
    query.limit = pageSize;
  }

  if (pageOffset) {
    query.offset = pageOffset;
  }

  if (sortField && sortOrder && userAttributes.includes(sortField)) {
    query.order = [[sortField, sortOrder]];
  } else if (sortField && sortOrder && roleAttributes.includes(sortField)) {
    query.order = [[{ model: Role, as: 'role' }, sortField, sortOrder]];
  }

  const employees = await User.findAndCountAll(query);

  return employees;
};

/**
 * Add employee to an agency client's account
 * @param {uuid} accountId
 * @param {uuid} userId
 * @returns {Promise} User
 */
const addEmployee = async (accountId, userId) => {
  // * Check if employee is already part of account
  const employeeExists = await AccountEmployee.findOne({
    where: { accountId, userId },
  });

  if (employeeExists) {
    throw new ErrorResponse('Employee is already assigned to account', 401);
  }

  const user = await userService.getUserById(userId);

  // * Check if user is an agency employee
  if (user.role.level !== 'agency') {
    throw new ErrorResponse('User is not an agency employee', 401);
  }

  // * Create AccountEmployee record
  await AccountEmployee.create({
    accountId,
    userId,
  });

  return user;
};

/**
 * Delete employee from an account
 * @param {uuid} accountId
 * @param {uuid} userId
 * @returns {Promise} User
 */
const deleteEmployee = async (accountId, userId) => {
  const user = await userService.getUserById(userId);

  await AccountEmployee.destroy({
    where: {
      accountId,
      userId,
    },
  });

  return user;
};

module.exports = {
  getEmployees,
  addEmployee,
  deleteEmployee,
};
