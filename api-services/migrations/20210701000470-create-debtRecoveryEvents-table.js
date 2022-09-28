'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('debtRecoveryEvents', {
      debtRecoveryEventId: {
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
      recoveryCurrencyCode: {
        type: Sequelize.STRING,
      },
      recoveryCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      overPaymentCreditCurrencyCode: {
        type: Sequelize.STRING,
      },
      overPaymentCreditCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      debtRecoveryType: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('debtRecoveryEvents');
  },
};
