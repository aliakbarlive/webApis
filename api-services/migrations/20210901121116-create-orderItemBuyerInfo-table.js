'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable(
          'orderItemBuyerInfos',
          {
            orderItemBuyerInfoId: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
            },
            orderItemId: {
              type: Sequelize.BIGINT,
              references: {
                model: {
                  tableName: 'orderItems',
                  schema: 'public',
                },
                key: 'orderItemId',
              },
            },
            buyerCustomizedInfo: Sequelize.JSONB,
            giftWrapPriceCurrencyCode: Sequelize.STRING,
            giftWrapPriceAmount: Sequelize.DECIMAL,
            giftWrapTaxCurrencyCode: Sequelize.STRING,
            giftWrapTaxAmount: Sequelize.DECIMAL,
            giftMessageText: Sequelize.STRING,
            giftWrapLevel: Sequelize.STRING,
            createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
            },
            updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
            },
          },
          { transaction: t }
        ),
      ]);
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orderItemBuyerInfos');
  },
};
