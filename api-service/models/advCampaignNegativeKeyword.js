'use strict';
const { Model } = require('sequelize');
const AdvCampaign = require('./advCampaign');

module.exports = (sequelize, DataTypes) => {
  class AdvCampaignNegativeKeyword extends Model {
    static associate({ AdvCampaign }) {
      this.belongsTo(AdvCampaign, {
        foreignKey: 'advCampaignId',
        constraints: false,
      });
    }
  }

  AdvCampaignNegativeKeyword.init(
    {
      advCampaignNegativeKeywordId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      advCampaignId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: AdvCampaign,
          key: 'advCampaignId',
        },
      },
      keywordText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      matchType: {
        type: DataTypes.ENUM('negativeExact', 'negativePhrase'),
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM('enabled', 'paused', 'archived'),
        allowNull: false,
      },
      syncAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      servingStatus: DataTypes.STRING,
      creationDate: DataTypes.BIGINT,
      lastUpdatedDate: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'AdvCampaignNegativeKeyword',
      tableName: 'advCampaignNegativeKeywords',
      timestamps: false,
    }
  );
  return AdvCampaignNegativeKeyword;
};
