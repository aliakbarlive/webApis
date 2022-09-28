'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('adjustmentItems', {
      adjustmentItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      adjustmentEventId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'adjustmentEvents',
            schema: 'public',
          },
          key: 'adjustmentEventId',
        },
      },
      asin: {
        type: Sequelize.STRING,
      },
      sellerSku: {
        type: Sequelize.STRING,
      },
      fnSku: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      totalCurrencyCode: {
        type: Sequelize.STRING,
      },
      totalCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      perUnitCurrencyCode: {
        type: Sequelize.STRING,
      },
      perUnitCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      productDescription: {
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
    await queryInterface.dropTable('adjustmentItems');
  },
};
