'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advOptimizationBatches', {
      advOptimizationBatchId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'userId',
        },
      },
      advProfileId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'advProfiles',
            schema: 'public',
          },
          key: 'advProfileId',
        },
      },
      campaignType: {
        type: Sequelize.ENUM(
          'sponsoredProducts',
          'sponsoredBrands',
          'sponsoredDisplay'
        ),
        allowNull: false,
      },
      recordType: {
        type: Sequelize.ENUM(
          'campaigns',
          'adGroups',
          'keywords',
          'targets',
          'productAds',
          'searchTerms'
        ),
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
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
    await queryInterface.dropTable('advOptimizationBatches');
  },
};
