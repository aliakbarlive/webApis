'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payWithAmazonEvents', {
      payWithAmazonEventId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
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
      sellerOrderId: {
        type: Sequelize.STRING,
      },
      transactionPostedDate: {
        type: Sequelize.DATE,
      },
      businessObjectType: {
        type: Sequelize.STRING,
      },
      salesChannel: {
        type: Sequelize.STRING,
      },
      paymentAmountType: {
        type: Sequelize.STRING,
      },
      amountDescription: {
        type: Sequelize.STRING,
      },
      fulfillmentChannel: {
        type: Sequelize.STRING,
      },
      storeName: {
        type: Sequelize.STRING,
      },
      chargeType: {
        type: Sequelize.STRING,
      },
      chargeCurrencyCode: {
        type: Sequelize.STRING,
      },
      chargeCurrencyAmount: {
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
    await queryInterface.dropTable('payWithAmazonEvents');
  },
};
