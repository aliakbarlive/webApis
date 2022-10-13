'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          'roles',
          'hasAccessToAllClients',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction }
        ),

        queryInterface.addColumn(
          'roles',
          'department',
          {
            type: Sequelize.STRING,
            defaultValue: 'operations',
          },
          { transaction }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('roles', 'hasAccessToAllClients', {
          transaction,
        }),

        queryInterface.removeColumn('roles', 'department', { transaction }),
      ]);
    });
  },
};
