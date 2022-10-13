'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shipmentItems', {
      shipmentItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      shipmentEventId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'shipmentEvents',
            schema: 'public',
          },
          key: 'shipmentEventId',
        },
      },
      orderItemId: {
        type: Sequelize.STRING,
      },
      amazonOrderId: {
        type: Sequelize.STRING,
      },
      sellerSku: {
        type: Sequelize.STRING,
      },
      quantityShipped: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('shipmentItems');
  },
};
