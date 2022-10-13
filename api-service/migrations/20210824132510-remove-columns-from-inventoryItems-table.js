'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('inventoryItems', 'price', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'mfnListingExists', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'mfnFulfillableQty', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'afnListingExists', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'afnWarehouseQty', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'afnFulfillableQty', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'afnUnsellableQty', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'afnReservedQty', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'afnTotalQty', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'perUnitVolume', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'afnInboundWorkingQty', {
          transaction: t,
        }),
        queryInterface.removeColumn('inventoryItems', 'afnInboundShippedQty', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'inventoryItems',
          'afnInboundReceivingQty',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn('inventoryItems', 'afnResearchingQty', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'inventoryItems',
          'afnReservedFutureSupplyQty',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn(
          'inventoryItems',
          'afnFutureSupplyBuyableQty',
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn('inventoryItems', 'leadTime', {
          transaction: t,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'inventoryItems',
          'price',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'mfnListingExists',
          {
            type: Sequelize.BOOLEAN,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'mfnFulfillableQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnListingExists',
          {
            type: Sequelize.BOOLEAN,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnWarehouseQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnFulfillableQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnUnsellableQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnReservedQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnTotalQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'perUnitVolume',
          {
            type: Sequelize.DECIMAL,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnInboundWorkingQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnInboundShippedQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnInboundReceivingQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnResearchingQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnReservedFutureSupplyQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'afnFutureSupplyBuyableQty',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'inventoryItems',
          'leadTime',
          {
            type: Sequelize.INTEGER,
            defaultValue: 30,
          },
          { transaction: t }
        ),
      ]);
    });
  },
};
