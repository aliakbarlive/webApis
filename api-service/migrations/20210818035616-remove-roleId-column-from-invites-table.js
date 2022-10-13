'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('invites', 'roleId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('invites', 'roleId', {
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
};
