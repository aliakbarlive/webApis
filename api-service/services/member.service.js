const { User, Member } = require('../models');

/**
 * Add user to account
 * @param {uuid} userId
 * @param {uuid} accountId
 * @param {string} roleId
 * @returns {Promise} Member
 */
const addUserToAccount = async (userId, accountId, roleId) => {
  const member = await Member.create({
    accountId,
    userId,
    roleId,
  });

  return member;
};

/**
 * Get members by accountId.
 *
 * @param uuid accountId
 * @param object query
 * @returns object
 */
const getMembersByAccountId = async (accountId, query) => {
  const { pageSize, pageOffset, sort } = query;

  const members = await User.findAndCountAll({
    attributes: ['userId', 'firstName', 'lastName', 'email'],
    include: {
      attributes: [],
      model: Member,
      required: true,
      as: 'memberships',
      where: { accountId },
    },
    limit: pageSize,
    offset: pageOffset,
    order: sort,
  });

  return members;
};

module.exports = { addUserToAccount, getMembersByAccountId };
