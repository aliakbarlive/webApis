'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('members', {
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
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'roles',
            schema: 'public',
          },
          key: 'roleId',
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
    await queryInterface.dropTable('members');
  },
};
