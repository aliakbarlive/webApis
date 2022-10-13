const {
  User,
  Role,
  UserGroup,
  Permission,
  Cell,
  Member,
  Account,
  AgencyClient,
  sequelize,
} = require('../models');
const { literal, Op, where, col, fn, escape } = require('sequelize');

/**
 * @desc Create a user
 * @param {Object} reqBody
 * @returns {Promise<User>}
 */
const createUser = async (reqBody) => {
  const { userId } = await User.create(reqBody);

  const user = await getUserById(userId);

  return user;
};
const updateUser = async (reqBody, option) => {
  const user = await User.update(reqBody, option);
  return user;
};

/**
 * @desc Get user
 * @param {Object} query - Query attributes of a User
 * @returns {Promise<User>}
 */
const getUser = async (query) => {
  const user = await User.findOne({
    attributes: [
      'userId',
      'firstName',
      'lastName',
      'email',
      'isEmailVerified',
      'password',
    ],
    where: query,
    include: [
      {
        model: Role,
        as: 'role',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'allowPerGroup'],
        },
        include: [
          {
            model: Permission,
            as: 'permissions',
            attributes: ['access', 'feature'],
            through: { attributes: [] },
          },
        ],
      },
      { model: UserGroup, as: 'memberId' },
      {
        model: Member,
        as: 'memberships',
        include: {
          model: Account,
          as: 'account',
          attributes: ['accountId'],
          include: {
            model: AgencyClient,
            attributes: ['agencyClientId'],
          },
        },
      },
    ],
  });

  return user;
};

/**
 * @desc Get user by ID
 * @param {uuid} query - Query attributes of a User
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  const user = await User.findOne({
    attributes: ['userId', 'firstName', 'lastName', 'email', 'isEmailVerified'],
    where: { userId },
    include: {
      model: Role,
      as: 'role',
      attributes: ['roleId', 'name', 'level'],
    },
  });

  return user;
};

/**
 * Get the user using the first and last name
 * @param {String} firstName - first name of the employee
 * @param {String} lastName - last name of the employee
 * @returns
 */
const getUserByName = async (firstName, lastName) => {
  return await User.findOne({
    attributes: ['userId', 'firstName', 'lastName', 'email'],
    where: {
      lastName,
      firstName: {
        [Op.like]: `%${firstName}%`,
      },
    },
    include: {
      attributes: ['cellId', 'name', 'isPpc'],
      model: Cell,
      through: { attributes: [] },
    },
  });
};

const getUserByEmail = async (email) => {
  return await User.findOne({
    attributes: ['userId', 'firstName', 'lastName', 'email'],
    where: {
      email,
    },
  });
};

const getUserByDisplayName = async (displayName) => {
  //const escapedName = sequelize.escape(`${displayName}`);
  return await User.findOne({
    attributes: ['userId', 'firstName', 'lastName', 'email'],
    //where: literal(`similarity("firstName",${escapedName}) > 0.4`),
    where: {
      displayName,
    },
  });
};

const getUsersByUserRole = async (roleId) => {
  return await User.findAll({
    attributes: ['userId'],
    where: {
      roleId,
    },
  });
};

/**
 * Get the users with roleIds
 * @param {array} roleIds
 * @returns {array} userIds
 */
const getUsersByRoleId = async (roleIds) => {
  const users = await User.findAll({
    where: { roleId: { [Op.in]: roleIds } },
  });

  return users.map((user) => user.userId);
};

module.exports = {
  createUser,
  updateUser,
  getUser,
  getUserById,
  getUserByName,
  getUserByEmail,
  getUserByDisplayName,
  getUsersByUserRole,
  getUsersByRoleId,
};
