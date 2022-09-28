'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advChangeCollections', {
      advChangeCollectionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      advProfileId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          key: 'advProfileId',
          model: { tableName: 'advProfiles', schema: 'public' },
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
      userId: {
        type: Sequelize.UUID,
        references: {
          key: 'userId',
          model: { tableName: 'users', schema: 'public' },
        },
      },
      activityDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      advOptimizationBatchId: {
        type: Sequelize.INTEGER,
        references: {
          key: 'advOptimizationBatchId',
          model: { tableName: 'advOptimizationBatches', schema: 'public' },
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advChangeCollections');
  },
};
