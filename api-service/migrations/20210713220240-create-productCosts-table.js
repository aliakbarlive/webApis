'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productCosts', {
      productCostId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      inventoryItemId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'inventoryItems',
            schema: 'public',
          },
          key: 'inventoryItemId',
        },
      },
      cogsAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      shippingAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      miscAmount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      startDate: { type: Sequelize.DATE, allowNull: false },
      endDate: { type: Sequelize.DATE },
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
    await queryInterface.dropTable('productCosts');
  },
};
