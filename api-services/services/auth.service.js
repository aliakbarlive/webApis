const { User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const userService = require('../services/user.service');
const { where, col, fn } = require('sequelize');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUser(
    where(fn('lower', col('email')), fn('lower', email))
  );

  if (!user || !(await user.matchPassword(password))) {
    throw new ErrorResponse('Incorrect email or password', 401);
  }

  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
};
