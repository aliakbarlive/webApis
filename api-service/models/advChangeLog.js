'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvChangeLog extends Model {
    static associate({ User, AdvProfile, AdvCampaign, AdvOptimization }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });

      this.belongsTo(AdvProfile, {
        foreignKey: 'advProfileId',
        as: 'advProfile',
      });

      this.belongsTo(AdvCampaign, {
        foreignKey: 'advCampaignId',
        as: 'campaign',
      });

      this.belongsTo(AdvOptimization, {
        foreignKey: 'advOptimizationId',
        as: 'advOptimization',
      });
    }
  }

  AdvChangeLog.init(
    {
      advChangeLogId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      advProfileId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
      },
      advCampaignId: {
        type: DataTypes.BIGINT,
      },
      advAdGroupId: {
        type: DataTypes.BIGINT,
      },
      advProductAdId: {
        type: DataTypes.BIGINT,
      },
      advKeywordId: {
        type: DataTypes.BIGINT,
      },
      advTargetId: {
        type: DataTypes.BIGINT,
      },
      advCampaignNegativeKeywordId: {
        type: DataTypes.BIGINT,
      },
      advNegativeKeywordId: {
        type: DataTypes.BIGINT,
      },
      advNegativeTargetId: {
        type: DataTypes.BIGINT,
      },
      recordType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      previousData: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      newData: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      advOptimizationId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'AdvChangeLog',
      tableName: 'advChangeLogs',
    }
  );
  return AdvChangeLog;
};
