'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvCampaignBudgetRecommendation extends Model {
    static associate({ AdvCampaign }) {
      this.belongsTo(AdvCampaign, {
        foreignKey: 'advCampaignId',
        as: 'campaign',
      });
    }
  }
  AdvCampaignBudgetRecommendation.init(
    {
      advCampaignBudgetRecommendationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      advCampaignId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      suggestedBudget: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      sevenDaysMissedOpportunities: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'AdvCampaignBudgetRecommendation',
      tableName: 'advCampaignBudgetRecommendations',
    }
  );
  return AdvCampaignBudgetRecommendation;
};
