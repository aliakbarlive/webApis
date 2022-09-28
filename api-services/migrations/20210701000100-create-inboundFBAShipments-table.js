'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inboundFBAShipments', {
      inboundFBAShipmentId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      inboundFBAShipmentName: {
        type: Sequelize.STRING,
        allowNull: false,
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
      shipFromAddress: Sequelize.JSONB,
      destinationFulfillmentCenterId: Sequelize.STRING,
      inboundFBAShipmentStatus: {
        type: Sequelize.ENUM(
          'WORKING',
          'RECEIVING',
          'CANCELLED',
          'DELETED',
          'ERROR',
          'SHIPPED',
          'IN_TRANSIT',
          'CLOSED',
          'DELIVERED',
          'CHECKED_IN'
        ),
        allowNull: false,
      },
      labelPrepType: Sequelize.STRING,
      areCasesRequired: Sequelize.BOOLEAN,
      boxContentsSource: Sequelize.STRING,
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
    await queryInterface.dropTable('inboundFBAShipments');
  },
};
