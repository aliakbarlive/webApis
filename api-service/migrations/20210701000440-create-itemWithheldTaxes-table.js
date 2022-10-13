'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('itemWithheldTaxes', {
      itemTaxWithheldId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      shipmentItemId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'shipmentItems',
            schema: 'public',
          },
          key: 'shipmentItemId',
        },
      },
      rentalTransactionId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'rentalTransactionEvents',
            schema: 'public',
          },
          key: 'rentalTransactionId',
        },
      },
      taxCollectionModel: {
        type: Sequelize.STRING,
      },
      chargeType: {
        type: Sequelize.STRING,
      },
      currencyCode: {
        type: Sequelize.STRING,
      },
      currencyAmount: {
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
    await queryInterface.dropTable('itemWithheldTaxes');
  },
};
