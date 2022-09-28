'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fbaLiquidationEvents', {
      fbaLiquidationEventId: {
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
      originalRemovalOrderId: {
        type: Sequelize.STRING,
      },
      liquidationProceedsCurrencyCode: {
        type: Sequelize.STRING,
      },
      liquadationProceedsCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      liquadationFeeCurrencyCode: {
        type: Sequelize.STRING,
      },
      liquadationFeeCurrencyAmount: {
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
    await queryInterface.dropTable('fbaLiquidationEvents');
  },
};
