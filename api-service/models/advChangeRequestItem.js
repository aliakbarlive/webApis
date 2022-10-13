'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvChangeRequestItem extends Model {
    static associate({ User, AdvCampaign, AdvChangeRequest, AdvOptimization }) {
      this.belongsTo(AdvCampaign, {
        foreignKey: 'advCampaignId',
        as: 'campaign',
      });

      this.belongsTo(AdvChangeRequest, {
        foreignKey: 'advChangeRequestId',
        as: 'changeRequest',
      });

      this.belongsTo(User, {
        foreignKey: 'evaluatedBy',
        as: 'evaluator',
      });

      this.belongsTo(AdvOptimization, {
        foreignKey: 'advOptimizationId',
        as: 'optimization',
      });
    }
  }
  AdvChangeRequestItem.init(
    {
      advChangeRequestItemId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      advChangeRequestId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      advCampaignId: {
        type: DataTypes.BIGINT,
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      advOptimizationId: DataTypes.INTEGER,
      evaluatedBy: {
        type: DataTypes.UUID,
      },
      evaluatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'AdvChangeRequestItem',
      tableName: 'advChangeRequestItems',
    }
  );
  return AdvChangeRequestItem;
};
