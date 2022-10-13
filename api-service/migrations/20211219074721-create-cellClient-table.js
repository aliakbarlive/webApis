'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cellClient', {
      cellId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'cells',
            schema: 'public',
          },
          key: 'cellId',
        },
      },
      agencyClientId: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: {
            tableName: 'agencyClients',
            schema: 'public',
          },
          key: 'agencyClientId',
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
    await queryInterface.dropTable('cellClient');
  },
};
