'use strict';
const { Model } = require('sequelize');

const AdvCampaign = require('./advCampaign');
const AdvAdGroup = require('./advAdGroup');
const AdvTarget = require('./advTarget');
const AdvKeyword = require('./advKeyword');

module.exports = (sequelize, DataTypes) => {
  class AdvSearchTerm extends Model {
    static associate({
      AdvCampaign,
      AdvAdGroup,
      AdvKeyword,
      AdvTarget,
      AdvSearchTermRecord,
    }) {
      this.belongsTo(AdvCampaign, {
        foreignKey: 'advCampaignId',
        constraints: false,
      });

      this.belongsTo(AdvAdGroup, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });

      this.belongsTo(AdvKeyword, {
        foreignKey: 'advKeywordId',
        constraints: false,
      });

      this.belongsTo(AdvTarget, {
        foreignKey: 'advTargetId',
        constraints: false,
      });

      this.hasMany(AdvSearchTermRecord, {
        foreignKey: 'advSearchTermId',
        as: 'records',
        constraints: false,
      });
    }
  }
  AdvSearchTerm.init(
    {
      advSearchTermId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      advCampaignId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: AdvCampaign,
          key: 'advCampaignId',
        },
      },
      advAdGroupId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: AdvAdGroup,
          key: 'advAdGroupId',
        },
      },
      advTargetId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: AdvTarget,
          key: 'advTargetId',
        },
      },
      advKeywordId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: AdvKeyword,
          key: 'advKeywordId',
        },
      },
      target: DataTypes.ENUM('product', 'keyword'),
      query: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      convertedAsNegativeKeyword: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      convertedAsCampaignNegativeKeyword: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'AdvSearchTerm',
      tableName: 'advSearchTerms',
      timestamps: false,
    }
  );
  return AdvSearchTerm;
};
