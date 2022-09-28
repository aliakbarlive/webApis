'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shipmentAdjustmentItems', {
      shipmentAdjustmentItemId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      refundEventId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'refundEvents',
            schema: 'public',
          },
          key: 'refundEventId',
        },
      },
      chargebackEventId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'chargebackEvents',
            schema: 'public',
          },
          key: 'chargebackEventId',
        },
      },
      guaranteeEventId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'guaranteeClaimEvents',
            schema: 'public',
          },
          key: 'guaranteeEventId',
        },
      },
      orderAdjustmentItemId: {
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
    await queryInterface.dropTable('shipmentAdjustmentItems');
  },
};
