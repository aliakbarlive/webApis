'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('upsells', 'soldBy', {
      type: Sequelize.UUID,
      references: {
        model: {
          tableName: 'users',
          schema: 'public',
        },
        key: 'userId',
      },
    });

    await queryInterface.addColumn('upsells', 'commissionAmount', {
      type: Sequelize.FLOAT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('upsells', 'soldBy');

    await queryInterface.removeColumn('upsells', 'commissionAmount');
  },
};
