'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leadConversation', {
      leadConversationId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      leadId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'leads',
            schema: 'public',
          },
          key: 'leadId',
        },
      },
      sentFrom: {
        type: Sequelize.STRING,
      },

      siPlatForm: {
        type: Sequelize.STRING,
      },

      siPlatFormValue: {
        type: Sequelize.STRING,
      },
      leadPlatForm: {
        type: Sequelize.STRING,
      },
      leadPlatFormValue: {
        type: Sequelize.STRING,
      },
      sentTo: {
        type: Sequelize.STRING,
      },
      sentToValue: {
        type: Sequelize.STRING,
      },
      fullMessage: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('leadConversation');
  },
};
