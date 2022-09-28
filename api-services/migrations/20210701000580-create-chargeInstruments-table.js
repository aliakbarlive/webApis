'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chargeInstruments', {
      chargeInstrumentId: {
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
      tail: {
        type: Sequelize.STRING,
      },
      currencyCode: {
        type: Sequelize.STRING,
      },
      currencyAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('chargeInstruments');
  },
};
