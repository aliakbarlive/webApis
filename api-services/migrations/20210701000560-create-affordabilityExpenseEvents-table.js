'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('affordabilityExpenseEvents', {
      affordabilityExpenseEventId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      amazonOrderId: {
        type: Sequelize.STRING,
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
      transactionType: {
        type: Sequelize.STRING,
      },
      baseExpenseCurrencyCode: {
        type: Sequelize.STRING,
      },
      baseExpenseCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      taxTypeCGSTCurrencyCode: {
        type: Sequelize.STRING,
      },
      taxTypeCGSTCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      taxTypeSGSTCurrencyCode: {
        type: Sequelize.STRING,
      },
      taxTypeSGSTCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      taxTypeIGSTCurrencyCode: {
        type: Sequelize.STRING,
      },
      taxTypeIGSTCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      totalExpenseCurrencyCode: {
        type: Sequelize.STRING,
      },
      totalExpenseCurrencyAmount: {
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
    await queryInterface.dropTable('affordabilityExpenseEvents');
  },
};
