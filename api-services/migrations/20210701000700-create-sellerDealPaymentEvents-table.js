'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sellerDealPaymentEvents', {
      sellerDealPaymentEventId: {
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
      postedDate: {
        type: Sequelize.DATE,
      },
      dealId: {
        type: Sequelize.STRING,
      },
      dealDescription: {
        type: Sequelize.STRING,
      },
      eventType: {
        type: Sequelize.STRING,
      },
      feeType: {
        type: Sequelize.STRING,
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
      totalCurrencyCode: {
        type: Sequelize.STRING,
      },
      totalCurrencyAmount: {
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
    await queryInterface.dropTable('sellerDealPaymentEvents');
  },
};
