'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userGroup', {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      departmentId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'squads',
            schema: 'public',
          },
          key: 'squadId',
        },
      },
      squadId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'squads',
            schema: 'public',
          },
          key: 'squadId',
        },
      },
      podId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'pods',
            schema: 'public',
          },
          key: 'podId',
        },
      },
      cellId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'cells',
            schema: 'public',
          },
          key: 'cellId',
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
    await queryInterface.dropTable('userGroup');
  },
};
