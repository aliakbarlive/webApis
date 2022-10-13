'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orderItems', {
      orderItemId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      amazonOrderId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'orders',
            schema: 'public',
          },
          key: 'amazonOrderId',
        },
      },
      asin: Sequelize.STRING,
      productName: Sequelize.TEXT,
      sku: Sequelize.STRING,
      itemStatus: Sequelize.STRING,
      quantity: Sequelize.INTEGER,
      currency: Sequelize.STRING,
      itemPrice: Sequelize.FLOAT,
      itemTax: Sequelize.FLOAT,
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
    await queryInterface.dropTable('orderItems');
  },
};
