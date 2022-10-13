'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('itemPromotions', {
      itemPromotionId: {
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
    await queryInterface.dropTable('itemPromotions');
  },
};
