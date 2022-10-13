'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'clients',
        access: 'clients.bulk.update',
        description: 'Bulk Update Client Details',
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
          {
            access: 'clients.bulk.update',
          },
          { transaction }
        ),
      ]);
    });
  },
};
