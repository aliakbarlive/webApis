'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('employees', 'roleId', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'roles',
          schema: 'public',
        },
        key: 'roleId',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('employees', 'roleId', {
      references: {
        model: {
          tableName: 'roles',
          schema: 'public',
        },
        key: 'roleId',
      },
    });
  },
};
