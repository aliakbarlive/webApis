'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productAdsPaymentEvents', {
      productAdsPaymentId: {
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
      invoiceId: {
        type: Sequelize.STRING,
      },
      postedDate: {
        type: Sequelize.DATE,
      },
      taxValueCurrencyCode: {
        type: Sequelize.STRING,
      },
      taxValueCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      baseCurrencyCode: {
        type: Sequelize.STRING,
      },
      baseCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      transactionType: {
        type: Sequelize.STRING,
      },
      transactionCurrencyCode: {
        type: Sequelize.STRING,
      },
      transactionCurrencyAmount: {
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
    await queryInterface.dropTable('productAdsPaymentEvents');
  },
};
