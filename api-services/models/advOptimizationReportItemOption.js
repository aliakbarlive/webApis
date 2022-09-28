'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvOptimizationReportItemOption extends Model {
    static associate({ AdvOptimizationReportItem, AdvOptimizationReportRule }) {
      this.belongsTo(AdvOptimizationReportItem, {
        foreignKey: 'advOptimizationReportItemId',
        as: 'item',
      });

      this.belongsTo(AdvOptimizationReportRule, {
        foreignKey: 'advOptimizationReportRuleId',
        as: 'rule',
      });
    }
  }
  AdvOptimizationReportItemOption.init(
    {
      advOptimizationReportItemOptionId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      advOptimizationReportItemId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      advOptimizationReportRuleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      selected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'AdvOptimizationReportItemOption',
      tableName: 'advOptimizationReportItemOptions',
    }
  );
  return AdvOptimizationReportItemOption;
};
