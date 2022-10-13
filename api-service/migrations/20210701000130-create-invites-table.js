'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invites', {
      inviteId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      inviteEmailExpire: { type: Sequelize.DATE },
      status: { type: Sequelize.STRING },
      sentAt: { type: Sequelize.DATE },
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
    await queryInterface.dropTable('invites');
  },
};
