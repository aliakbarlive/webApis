'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clientChecklists', {
      clientChecklistId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      checklistId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'checklists',
            schema: 'public',
          },
          key: 'checklistId',
        },
      },
      agencyClientId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'agencyClients',
            schema: 'public',
          },
          key: 'agencyClientId',
        },
      },
      status: {
        type: Sequelize.ENUM,
        values: ['incomplete', 'in-progress', 'complete'],
        allowNull: false,
      },
      toggle: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable('clientChecklists');
  },
};
