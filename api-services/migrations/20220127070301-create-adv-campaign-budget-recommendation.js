'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advCampaignBudgetRecommendations', {
      advCampaignBudgetRecommendationId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      advCampaignId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          key: 'advCampaignId',
          model: { tableName: 'advCampaigns', schema: 'public' },
        },
      },
      suggestedBudget: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      sevenDaysMissedOpportunities: {
        type: Sequelize.JSONB,
        allowNull: true,
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
    await queryInterface.dropTable('advCampaignBudgetRecommendations');
  },
};
