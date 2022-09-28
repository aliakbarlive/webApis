'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orderAddresses', {
      amazonOrderId: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: {
            tableName: 'orders',
            schema: 'public',
          },
          key: 'amazonOrderId',
        },
      },
      shipCity: Sequelize.STRING,
      shipState: Sequelize.STRING,
      shipPostalCode: Sequelize.STRING,
      shipCountry: Sequelize.STRING,
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
    await queryInterface.dropTable('orderAddresses');
  },
};
