'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('employees', 'accountId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('employees', 'accountId', {
      type: Sequelize.UUID,
      primaryKey: true,
      references: {
        model: {
          tableName: 'accounts',
          schema: 'public',
        },
        key: 'accountId',
      },
    });
  },
};
