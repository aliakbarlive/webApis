'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rentalTransactionEvents', {
      rentalTransactionId: {
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
      amazonOrderId: {
        type: Sequelize.STRING,
      },
      rentalEventType: {
        type: Sequelize.STRING,
      },
      extensionLength: {
        type: Sequelize.INTEGER,
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
      marketplaceName: {
        type: Sequelize.STRING,
      },
      rentalInitialValueCurrencyCode: { type: Sequelize.STRING },
      rentalInitialValueCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      rentalReimbursementCurrencyCode: { type: Sequelize.STRING },
      rentalReimbursementCurrencyAmount: {
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
    await queryInterface.dropTable('rentalTransactionEvents');
  },
};
