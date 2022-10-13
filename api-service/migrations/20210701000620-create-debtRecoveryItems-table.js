'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('debtRecoveryItems', {
      debtRecoveryItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      debtRecoveryEventId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'debtRecoveryEvents',
            schema: 'public',
          },
          key: 'debtRecoveryEventId',
        },
      },
      groupEndDate: {
        type: Sequelize.DATE,
      },
      groupBeginDate: {
        type: Sequelize.DATE,
      },
      originalCurrencyCode: {
        type: Sequelize.STRING,
      },
      originalCurrencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      recoveryCurrencyCode: {
        type: Sequelize.STRING,
      },
      recoveryCurrencyAmount: {
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
    await queryInterface.dropTable('debtRecoveryItems');
  },
};
