'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('solutionProviderCreditEvents', {
      solutionProviderCreditEventId: {
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
      providerTransactionType: {
        type: Sequelize.STRING,
      },
      sellerOrderId: {
        type: Sequelize.STRING,
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
      marketplaceCountryCode: {
        type: Sequelize.STRING,
      },
      sellerId: {
        type: Sequelize.STRING,
      },
      sellerStoreName: {
        type: Sequelize.STRING,
      },
      providerId: {
        type: Sequelize.STRING,
      },
      providerStoreName: {
        type: Sequelize.STRING,
      },
      transactionAmountCurrencyCode: {
        type: Sequelize.STRING,
      },
      transactionAmountCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      transactionCreationDate: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('solutionProviderCreditEvents');
  },
};
