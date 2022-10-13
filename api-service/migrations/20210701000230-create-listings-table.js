'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('listings', {
      listingId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
      groupedAsin: {
        type: Sequelize.STRING,
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
      title: {
        type: Sequelize.STRING,
      },
      keywords: {
        type: Sequelize.STRING,
      },
      parent_asin: {
        type: Sequelize.STRING,
      },
      link: {
        type: Sequelize.STRING,
      },
      brand: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: Sequelize.DECIMAL,
      quantity: Sequelize.INTEGER,
      status: Sequelize.STRING,
      featureBullets: Sequelize.JSON,
      listingImages: {
        type: Sequelize.JSONB,
      },
      buyboxWinner: Sequelize.TEXT,
      categories: Sequelize.JSONB,
      reviewsTotal: Sequelize.INTEGER,
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
    await queryInterface.dropTable('listings');
  },
};
