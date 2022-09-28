'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('initialSyncStatus', {
      accountId: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: {
            tableName: 'accounts',
            schema: 'public',
          },
          key: 'accountId',
        },
      },
      inventory: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'COMPLETED'],
        defaultValue: 'PENDING',
      },
      orders: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'COMPLETED'],
        defaultValue: 'PENDING',
      },
      financialEvents: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'COMPLETED'],
        defaultValue: 'PENDING',
      },
      products: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'COMPLETED'],
        defaultValue: 'PENDING',
      },
      reviews: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'COMPLETED'],
        defaultValue: 'PENDING',
      },
      inboundFBAShipments: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'COMPLETED'],
        defaultValue: 'PENDING',
      },
      inboundFBAShipmentItems: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'COMPLETED'],
        defaultValue: 'PENDING',
      },
      advSnapshots: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'COMPLETED'],
        defaultValue: 'PENDING',
      },
      advPerformanceReport: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'COMPLETED'],
        defaultValue: 'PENDING',
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
    await queryInterface.dropTable('initialSyncStatus');
  },
};
