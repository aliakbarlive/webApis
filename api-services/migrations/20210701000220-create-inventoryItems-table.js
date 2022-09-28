'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inventoryItems', {
      inventoryItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      asin: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'products',
            schema: 'public',
          },
          key: 'asin',
        },
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
      marketplaceId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'marketplaces',
            schema: 'public',
          },
          key: 'marketplaceId',
        },
      },
      defaultCog: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      sellerSku: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fnSku: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productName: {
        type: Sequelize.STRING,
      },
      condition: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      mfnListingExists: {
        type: Sequelize.BOOLEAN,
      },
      mfnFulfillableQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      afnListingExists: {
        type: Sequelize.BOOLEAN,
      },
      afnWarehouseQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      afnFulfillableQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      afnUnsellableQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      afnReservedQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      afnTotalQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      perUnitVolume: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      afnInboundWorkingQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      afnInboundShippedQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      afnInboundReceivingQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      afnResearchingQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      afnReservedFutureSupplyQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      afnFutureSupplyBuyableQty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      leadTime: {
        type: Sequelize.INTEGER,
        defaultValue: 30,
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
    await queryInterface.dropTable('inventoryItems');
  },
};
