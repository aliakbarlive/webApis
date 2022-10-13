'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvHistory extends Model {
    static associate({ AdvProfile, AdvCampaign, User }) {
      this.belongsTo(AdvProfile, {
        foreignKey: 'advProfileId',
        as: 'advProfile',
      });

      this.belongsTo(AdvCampaign, {
        foreignKey: 'advCampaignId',
        as: 'campaign',
      });

      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  AdvHistory.init(
    {
      advProfileId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      entityId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      changeType: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      advCampaignId: {
        type: DataTypes.BIGINT,
      },
      advAdGroupId: {
        type: DataTypes.BIGINT,
      },
      previousValue: {
        type: DataTypes.STRING,
      },
      newValue: {
        type: DataTypes.STRING,
      },
      metadata: {
        type: DataTypes.JSONB,
      },
      userId: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: 'AdvHistory',
      tableName: 'advHistories',
      timestamps: false,
    }
  );
  return AdvHistory;
};
