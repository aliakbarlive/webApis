'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable(
          'inventoryDetails',
          {
            inventoryDetailId: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
            },
            inventoryItemId: {
              type: Sequelize.BIGINT,
              references: {
                model: {
                  tableName: 'inventoryItems',
                  schema: 'public',
                },
                key: 'inventoryItemId',
              },
            },
            fulfillableQuantity: {
              type: Sequelize.INTEGER,
              defaultValue: 0,
            },
            inboundWorkingQuantity: {
              type: Sequelize.INTEGER,
              defaultValue: 0,
            },
            inboundShippedQuantity: {
              type: Sequelize.INTEGER,
              defaultValue: 0,
            },
            inboundReceivingQuantity: {
              type: Sequelize.INTEGER,
              defaultValue: 0,
            },
            reservedQuantity: {
              type: Sequelize.JSONB,
            },
            researchingQuantity: {
              type: Sequelize.JSONB,
            },
            unfulfillableQuantity: {
              type: Sequelize.JSONB,
            },
            futureSupplyQuantity: {
              type: Sequelize.JSONB,
            },
            createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
            },
            updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
            },
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('inventoryDetails', { transaction: t }),
      ]);
    });
  },
};
