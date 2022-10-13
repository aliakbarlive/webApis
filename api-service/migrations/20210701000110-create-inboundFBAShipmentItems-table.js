'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inboundFBAShipmentItems', {
      inboundFBAShipmentItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      inboundFBAShipmentId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sellerSku: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fulfillmentNetworkSku: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantityShipped: Sequelize.INTEGER,
      quantityReceived: Sequelize.INTEGER,
      quantityInCase: Sequelize.INTEGER,
      prepDetailsList: Sequelize.JSONB,
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
    await queryInterface.dropTable('inboundFBAShipmentItems');
  },
};
