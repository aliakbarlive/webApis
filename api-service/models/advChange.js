'use strict';
const { Model } = require('sequelize');
const AdvCampaign = require('./advCampaign');
const AdvAdGroup = require('./advAdGroup');
const AdvKeyword = require('./advKeyword');
const AdvTarget = require('./advTarget');
const AdvProductAd = require('./advProductAd');
const AdvNegativeKeyword = require('./advNegativeKeyword');
const AdvNegativeTarget = require('./advNegativeTarget');
const AdvCampaignNegativeKeyword = require('./advCampaignNegativeKeyword');
const AdvChangeCollection = require('./advChangeCollection');
const AdvOptimization = require('./advOptimization');

module.exports = (sequelize, DataTypes) => {
  class AdvChange extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvCampaign }) {
      this.belongsTo(AdvCampaign, {
        foreignKey: 'advCampaignId',
        as: 'campaign',
      });
    }
  }
  AdvChange.init(
    {
      advChangeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      advChangeCollectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          key: 'advChangeCollectionId',
          model: AdvChangeCollection,
        },
      },
      advCampaignId: {
        type: DataTypes.BIGINT,
        references: {
          key: 'advCampaignId',
          model: AdvCampaign,
        },
      },
      advAdGroupId: {
        type: DataTypes.BIGINT,
        references: {
          key: 'advAdGroupId',
          model: AdvAdGroup,
        },
      },
      advKeywordId: {
        type: DataTypes.BIGINT,
        references: {
          key: 'advKeywordId',
          model: AdvKeyword,
        },
      },
      advTargetId: {
        type: DataTypes.BIGINT,
        references: {
          key: 'advTargetId',
          model: AdvTarget,
        },
      },
      advProductAdId: {
        type: DataTypes.BIGINT,
        references: {
          key: 'advProductAdId',
          model: AdvProductAd,
        },
      },
      advNegativeKeywordId: {
        type: DataTypes.BIGINT,
        references: {
          key: 'advNegativeKeywordId',
          model: AdvNegativeKeyword,
        },
      },
      advNegativeTargetId: {
        type: DataTypes.BIGINT,
        references: {
          key: 'advNegativeTargetId',
          model: AdvNegativeTarget,
        },
      },
      advCampaignNegativeKeywordId: {
        type: DataTypes.BIGINT,
        references: {
          key: 'advCampaignNegativeKeywordId',
          model: AdvCampaignNegativeKeyword,
        },
      },
      recordType: {
        type: DataTypes.ENUM(
          'campaign',
          'adGroup',
          'keyword',
          'target',
          'productAd',
          'negativeKeyword',
          'negativeTarget',
          'campaignNegativeKeyword'
        ),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      previousData: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      newData: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      hasSystemDiff: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      activityDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      advOptimizationId: {
        type: DataTypes.INTEGER,
        references: {
          key: 'advOptimizationId',
          model: AdvOptimization,
        },
      },
    },
    {
      sequelize,
      tableName: 'advChanges',
      modelName: 'AdvChange',
      timestamps: false,
    }
  );
  return AdvChange;
};
