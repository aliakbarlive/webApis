const { Op } = require('sequelize');

const Response = require('@utils/response');

const RolesRepository = require('./role.repository');

const listRoles = async (options) => {
  let roles = await RolesRepository.findAndCountRoles(options);

  return new Response()
    .withData(roles)
    .withMessage('Roles successfully fetched.');
};

const createRole = async (req) => {
  const { body } = req;

  const role = await RolesRepository.create(body);

  return new Response().withData(role).withMessage('Roles successfully added.');
};

const updateRole = async (req, roleId) => {
  const { body } = req;

  const role = await RolesRepository.update(body, {
    where: { roleId },
  });

  return new Response().withData(role).withMessage('Roles successfully added.');
};

module.exports = {
  listRoles,
  createRole,
  updateRole,
};
