'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('billingCurrencies', {
      pricebookId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      currencyId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currencyCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('billingCurrencies');
  },
};
