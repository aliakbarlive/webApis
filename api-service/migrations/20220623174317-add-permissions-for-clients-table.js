'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'clients',
        access: 'clients.assignment.list',
        description: 'View Unassigned Clients',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'clients',
        access: 'clients.assignment.assign',
        description: 'Assigned Client',
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
          { access: 'clients.assignment.list' },
          { access: 'clients.assignment.assign' },
          { transaction }
        ),
      ]);
    });
  },
};
