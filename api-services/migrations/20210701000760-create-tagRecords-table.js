'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tagRecords', {
      tagRecordId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
      tagId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'tags',
            schema: 'public',
          },
          key: 'tagId',
        },
      },
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
    await queryInterface.dropTable('tagRecords');
  },
};
