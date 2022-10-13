'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advProductAds', {
      advProductAdId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      advAdGroupId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      asin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.ENUM('enabled', 'paused', 'archived'),
      },
      servingStatus: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advProductAds');
  },
};
