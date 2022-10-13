'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('agencyClientsLogs', {
      agencyClientLogId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      agencyClientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'agencyClients',
            schema: 'public',
          },
          key: 'agencyClientId',
        },
      },
      tags: Sequelize.TEXT,
      message: { type: Sequelize.TEXT, allowNull: false },
      addedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'userId',
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
    await queryInterface.dropTable('agencyClientsLogs');
  },
};
