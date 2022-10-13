'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('administrators', {
      userId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'userId',
        },
      },
      accountId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: {
            tableName: 'accounts',
            schema: 'public',
          },
          key: 'accountId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('administrators');
  },
};
