'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('subscriptionCycleDate', {
      subscriptionCycleDateId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      agencyClientId: {
        type: DataTypes.UUID,
        references: {
          model: {
            tableName: 'agencyClients',
            schema: 'public',
          },
          key: 'agencyClientId',
        },
      },
      subscriptionStartDate: {
        type: DataTypes.DATE,
      },
      subscriptionValidUntilDate: {
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('subscriptionCycleDate');
  },
};
