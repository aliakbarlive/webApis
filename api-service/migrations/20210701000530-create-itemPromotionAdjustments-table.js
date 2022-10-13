'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('itemPromotionAdjustments', {
      itemPromotionAdjustmentId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      promotionId: {
        type: Sequelize.STRING,
      },
      promotionType: {
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
    await queryInterface.dropTable('itemPromotionAdjustments');
  },
};
