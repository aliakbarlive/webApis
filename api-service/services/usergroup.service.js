const { User, Role, UserGroup, Squad, Pod, Cell } = require('../models');
const roleService = require('@services/role.service');
const { Op, literal, fn, col } = require('sequelize');
const getSquadByName = async (name) => {
  return await Squad.findOne({
    where: { name },
  });
};

const getPodByName = async (name) => {
  return await Pod.findOne({
    where: { name },
  });
};

const getPodsByType = async (type) => {
  const roleIds = await roleService.getRoleIds([
    'Lead Generation Representative - New Leads',
    'Lead Generation Representative - Old Leads',
    'Lead Generation Representative - Pitcher',
    'Lead Generation Representative - Responses',
  ]);

  return await Pod.findAll({
    attributes: ['podId', 'name'],
    where: { type },
    include: {
      attributes: ['name'],
      model: Cell,
      include: {
        model: User,
        as: 'users',
        attributes: ['userId', 'firstName', 'lastName', 'email'],
        where: {
          roleId: {
            [Op.in]: roleIds,
          },
        },
        through: { attributes: [] },
      },
    },
  });
};

const getCellByName = async (name) => {
  return await Cell.findOne({
    where: { name },
  });
};

const addUserToGroup = async (body) => {
  return await UserGroup.create(body);
};

module.exports = {
  getSquadByName,
  getPodByName,
  getCellByName,
  addUserToGroup,
  getPodsByType,
};
