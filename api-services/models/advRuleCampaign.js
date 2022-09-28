'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdvRuleCampaign extends Model {
    static associate({ AdvCampaign, AdvRule }) {
      this.belongsTo(AdvCampaign, { foreignKey: 'advCampaignId' });
      this.belongsTo(AdvRule, { foreignKey: 'advRuleId' });
    }
  }

  AdvRuleCampaign.init(
    {
      advCampaignId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      advRuleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AdvRuleCampaign',
      tableName: 'advRuleCampaigns',
      timestamps: false,
    }
  );
  return AdvRuleCampaign;
};
