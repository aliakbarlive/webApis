'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('itemCharges', {
      itemChargeId: {
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
      safetReimbursementItemId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'safetReimbursementItems',
            schema: 'public',
          },
          key: 'safetReimbursementItemId',
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
      chargeType: {
        type: Sequelize.STRING,
      },
      currencyCode: {
        type: Sequelize.STRING,
      },
      currencyAmount: {
        type: Sequelize.DECIMAL,
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
    await queryInterface.dropTable('itemCharges');
  },
};
