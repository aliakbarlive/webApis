'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('listingAlertConfigurations', {
      listingAlertConfigurationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      listingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'listings',
            schema: 'public',
          },
          key: 'listingId',
        },
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      title: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      price: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      featureBullets: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      listingImages: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      buyboxWinner: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      categories: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reviews: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lowStock: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rating: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lowStockThreshold: {
        type: Sequelize.INTEGER,
        defaultValue: 50,
      },
      ratingCondition: {
        type: Sequelize.JSONB,
        defaultValue: {
          type: 'below',
          value: 3,
        },
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
    await queryInterface.dropTable('listingAlertConfigurations');
  },
};
