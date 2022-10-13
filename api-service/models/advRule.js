'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdvRule extends Model {
    static associate({
      Account,
      AdvRuleAction,
      AdvCampaign,
      AdvPortfolio,
      AdvRuleCampaign,
      AdvRuleProduct,
      AdvRulePortfolio,
    }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        as: 'account',
      });

      this.belongsTo(AdvRuleAction, {
        foreignKey: 'advRuleActionId',
        as: 'action',
      });

      this.belongsToMany(AdvCampaign, {
        through: AdvRuleCampaign,
        foreignKey: 'advRuleId',
        as: 'campaigns',
      });

      this.belongsToMany(AdvPortfolio, {
        through: AdvRulePortfolio,
        foreignKey: 'advRuleId',
        as: 'portfolios',
      });

      this.hasMany(AdvRuleProduct, {
        foreignKey: 'advRuleId',
        as: 'products',
      });
    }
  }
  AdvRule.init(
    {
      advRuleId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      marketplaceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      campaignType: {
        type: DataTypes.ENUM(
          'sponsoredProducts',
          'sponsoredBrands',
          'sponsoredDisplay'
        ),
        allowNull: false,
      },
      recordType: {
        type: DataTypes.ENUM(
          'campaigns',
          'adGroups',
          'keywords',
          'targets',
          'productAds',
          'searchTerms'
        ),
        allowNull: false,
      },
      filters: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      advRuleActionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      predefined: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      actionData: {
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      modelName: 'AdvRule',
      tableName: 'advRules',
    }
  );
  return AdvRule;
};
