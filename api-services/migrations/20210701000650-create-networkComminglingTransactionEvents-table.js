'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('networkComminglingTransactionEvents', {
      networkComminglingTransactionEventId: {
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
      transactionType: {
        type: Sequelize.STRING,
      },
      postedDate: {
        type: Sequelize.DATE,
      },
      netCoTransactionId: {
        type: Sequelize.STRING,
      },
      swapReason: {
        type: Sequelize.STRING,
      },
      asin: {
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
      taxExclusiveCurrencyCode: {
        type: Sequelize.STRING,
      },
      taxExclusiveCurrencyAmount: {
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
    await queryInterface.dropTable('networkComminglingTransactionEvents');
  },
};
