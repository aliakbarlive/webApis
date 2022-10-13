'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advReportEntities', {
      advReportEntityId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
          'productAds',
          'targets',
          'keywords',
          'negativeKeywords',
          'campaignNegativeKeywords',
          'negativeTargets'
        ),
        allowNull: false,
      },
      segment: {
        type: Sequelize.STRING,
      },
      tactic: {
        type: Sequelize.STRING,
      },
      hasSnapshot: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      hasPerformanceReport: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      marketPlace: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advReportEntities');
  },
};
