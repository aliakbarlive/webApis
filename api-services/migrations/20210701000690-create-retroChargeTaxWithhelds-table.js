'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('retroChargeTaxWithhelds', {
      retroChargeTaxWithheldId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      retroChargeEventId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'retroChargeEvents',
            schema: 'public',
          },
          key: 'retroChargeEventId',
        },
      },
      taxCollectionModel: {
        type: Sequelize.STRING,
      },
      chargeType: {
        type: Sequelize.STRING,
      },
      currencyCode: {
        type: Sequelize.STRING,
      },
      currencyAmount: {
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
    await queryInterface.dropTable('retroChargeTaxWithhelds');
  },
};
