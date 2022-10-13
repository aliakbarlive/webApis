'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('itemFees', {
      itemFeeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      shipmentItemId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'shipmentItems',
            schema: 'public',
          },
          key: 'shipmentItemId',
        },
      },
      imagingServicesFeeEventId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'imagingServicesFeeEvents',
            schema: 'public',
          },
          key: 'imagingServicesFeeEventId',
        },
      },
      rentalTransactionId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'rentalTransactionEvents',
            schema: 'public',
          },
          key: 'rentalTransactionId',
        },
      },
      serviceFeeEventId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'serviceFeeEvents',
            schema: 'public',
          },
          key: 'serviceFeeEventId',
        },
      },
      payWithAmazonEventId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'payWithAmazonEvents',
            schema: 'public',
          },
          key: 'payWithAmazonEventId',
        },
      },
      feeType: {
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
    await queryInterface.dropTable('itemFees');
  },
};
