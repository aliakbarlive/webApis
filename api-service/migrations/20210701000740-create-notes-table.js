'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notes', {
      noteId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      accountId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'accounts',
            schema: 'public',
          },
          key: 'accountId',
        },
      },
      reviewId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'reviews',
            schema: 'public',
          },
          key: 'reviewId',
        },
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
      asin: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'products',
            schema: 'public',
          },
          key: 'asin',
        },
      },
      amazonOrderId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'orders',
            schema: 'public',
          },
          key: 'amazonOrderId',
        },
      },
      body: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notes');
  },
};
