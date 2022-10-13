'use strict';

const newRoles = [
  {
    roleId: 40,
    name: 'ppc  manager',
    level: 'agency',
    groupLevel: 'squad',
    allowPerGroup: 1,
    department: 'ppc',
    hasAccessToAllClients: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkInsert('roles', newRoles, { transaction: t });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'roles',
      { name: { [Sequelize.Op.in]: newRoles.map((el) => el.name) } },
      {}
    );
  },
};
