'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        feature: 'clients',
        access: 'clients.profile.resetpassword',
        description: 'Show Reset Password Widget',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feature: 'clients',
        access: 'clients.delete',
        description: 'Delete Client',
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
          { access: 'clients.profile.resetpassword' },
          { access: 'clients.delete' },
          { transaction }
        ),
      ]);
    });
  },
};
