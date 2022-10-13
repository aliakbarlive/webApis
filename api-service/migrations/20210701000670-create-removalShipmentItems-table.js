'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('removalShipmentItems', {
      removalShipmentItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      removalShipmentEventId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'removalShipmentEvents',
            schema: 'public',
          },
          key: 'removalShipmentEventId',
        },
      },
      taxCollectionModel: {
        type: Sequelize.STRING,
      },
      fulfillmentNetworkSKU: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      revenueCurrencyCode: {
        type: Sequelize.STRING,
      },
      revenueCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      feeCurrencyCode: {
        type: Sequelize.STRING,
      },
      feeCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      taxCurrencyCode: {
        type: Sequelize.STRING,
      },
      taxCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      taxWithheldCurrencyCode: {
        type: Sequelize.STRING,
      },
      taxWithheldCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
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
    await queryInterface.dropTable('removalShipmentItems');
  },
};
