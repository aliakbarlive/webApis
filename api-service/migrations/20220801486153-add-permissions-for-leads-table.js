'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'leads',
        access: 'leads.admin.list',
        description: 'View Lead Admin List',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'leads',
        access: 'leads.admin.manage',
        description: 'Manage Lead Admin List',
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
          { access: 'leads.admin.list' },
          { access: 'leads.admin.manage' },
          { transaction }
        ),
      ]);
    });
  },
};
