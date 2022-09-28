'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      amazonOrderId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      accountId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'accounts',
            schema: 'public',
          },
          key: 'accountId',
        },
      },
      marketplaceId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'marketplaces',
            schema: 'public',
          },
          key: 'marketplaceId',
        },
      },
      purchaseDate: { type: Sequelize.DATE, allowNull: false },
      lastUpdateDate: { type: Sequelize.DATE, allowNull: false },
      orderStatus: { type: Sequelize.STRING, allowNull: false },
      sellerOrderId: { type: Sequelize.STRING, allowNull: false },
      fulfillmentChannel: Sequelize.STRING,
      salesChannel: Sequelize.STRING,
      shipServiceLevel: Sequelize.STRING,
      shippingPrice: Sequelize.FLOAT,
      shippingTax: Sequelize.FLOAT,
      giftWrapPrice: Sequelize.FLOAT,
      giftWrapTax: Sequelize.FLOAT,
      itemPromotionDiscount: Sequelize.FLOAT,
      shipPromotionDiscount: Sequelize.FLOAT,
      promotionIds: Sequelize.FLOAT,
      isBusinessOrder: Sequelize.BOOLEAN,
      purchaseOrderNumber: Sequelize.STRING,
      priceDesignation: Sequelize.STRING,
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
    await queryInterface.dropTable('orders');
  },
};
