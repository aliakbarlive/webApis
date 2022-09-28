'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'roles',
        access: 'roles.list',
        description: 'View List of roles',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'roles',
        access: 'roles.manage',
        description: 'Manage Roles',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert('permissions', permissions, { transaction }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete(
          'permissions',
          { access: 'roles.list' },
          { access: 'roles.manage' },
          { transaction }
        ),
      ]);
    });
  },
};
