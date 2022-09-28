'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('subscriptions', {
      subscriptionId: {
        type: Sequelize.STRING,
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
      status: { type: Sequelize.STRING },
      activatedAt: { type: Sequelize.DATE },
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
    await queryInterface.dropTable('subscriptions');
  },
};
