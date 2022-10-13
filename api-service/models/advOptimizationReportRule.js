'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvOptimizationReportRule extends Model {
    static associate({ AdvOptimizationReport, AdvRuleAction }) {
      this.belongsTo(AdvOptimizationReport, {
        foreignKey: 'advOptimizationReportId',
        as: 'optimizationReport',
      });

      this.belongsTo(AdvRuleAction, {
        foreignKey: 'advRuleActionId',
        as: 'action',
      });
    }
  }
  AdvOptimizationReportRule.init(
    {
      advOptimizationReportRuleId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      advOptimizationReportId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      advRuleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filters: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      advRuleActionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      actionData: {
        type: DataTypes.JSONB,
      },
      products: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      campaigns: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      portfolios: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: 'AdvOptimizationReportRule',
      tableName: 'advOptimizationReportRules',
      timestamps: false,
    }
  );
  return AdvOptimizationReportRule;
};
