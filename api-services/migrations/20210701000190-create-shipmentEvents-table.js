'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shipmentEvents', {
      shipmentEventId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      amazonOrderId: {
        type: Sequelize.STRING,
      },
      sellerOrderId: {
        type: Sequelize.STRING,
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
        references: {
          model: {
            tableName: 'marketplaces',
            schema: 'public',
          },
          key: 'marketplaceId',
        },
      },
      marketplaceName: {
        type: Sequelize.STRING,
      },
      postedDate: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('shipmentEvents');
  },
};
