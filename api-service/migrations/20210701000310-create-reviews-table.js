'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reviews', {
      reviewId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      listingId: {
        type: Sequelize.BIGINT,
        foreignKey: true,
        allowNull: false,
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
      title: Sequelize.TEXT,
      body: Sequelize.TEXT,
      link: Sequelize.TEXT,
      rating: Sequelize.DECIMAL,
      reviewDate: Sequelize.DATE,
      profileName: Sequelize.STRING,
      profileLink: Sequelize.STRING,
      profileId: Sequelize.STRING,
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
    await queryInterface.dropTable('reviews');
  },
};
