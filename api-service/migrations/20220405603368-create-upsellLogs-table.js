'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('upsellLogs', {
      upsellLogId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      upsellId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'upsells',
            schema: 'public',
          },
          key: 'upsellId',
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
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
    await queryInterface.dropTable('upsellLogs');
  },
};
