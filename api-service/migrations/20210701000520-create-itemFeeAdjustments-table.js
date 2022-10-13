'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('itemFeeAdjustments', {
      itemFeeAdjustmentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      shipmentAdjustmentItemId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'shipmentAdjustmentItems',
            schema: 'public',
          },
          key: 'shipmentAdjustmentItemId',
        },
      },
      orderAdjustmentItemId: {
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
    await queryInterface.dropTable('itemFeeAdjustments');
  },
};
