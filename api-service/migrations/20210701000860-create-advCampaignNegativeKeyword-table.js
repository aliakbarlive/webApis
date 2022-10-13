'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advCampaignNegativeKeywords', {
      advCampaignNegativeKeywordId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement: false,
      },
      advCampaignId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      keywordText: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      matchType: {
        type: Sequelize.ENUM('negativeExact', 'negativePhrase'),
        allowNull: false,
      },
      state: {
        type: Sequelize.ENUM('enabled', 'paused', 'archived'),
        allowNull: false,
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
    await queryInterface.dropTable('advCampaignNegativeKeywords');
  },
};
