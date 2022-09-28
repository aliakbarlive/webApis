'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advCampaigns', {
      advCampaignId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement: false,
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
      advPortfolioId: {
        type: Sequelize.BIGINT,
      },
      name: {
        type: Sequelize.STRING,
      },
      campaignType: {
        type: Sequelize.STRING,
      },
      targetingType: {
        type: Sequelize.STRING,
      },
      dailyBudget: {
        type: Sequelize.DECIMAL,
      },
      budget: {
        type: Sequelize.DECIMAL,
      },
      budgetType: {
        type: Sequelize.STRING,
      },
      premiumBidAdjustment: {
        type: Sequelize.BOOLEAN,
      },
      bidding: {
        type: Sequelize.JSONB,
      },
      startDate: {
        type: Sequelize.DATEONLY,
      },
      endDate: {
        type: Sequelize.DATEONLY,
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
      syncAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('advCampaigns');
  },
};
