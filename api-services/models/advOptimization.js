'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdvOptimization extends Model {
    static associate({
      AdvOptimizationBatch,
      AdvChange,
      AdvOptimizationReportItem,
      AdvOptimizationReportRule,
    }) {
      this.belongsTo(AdvOptimizationBatch, {
        foreignKey: 'advOptimizationBatchId',
        as: 'batch',
      });

      this.hasMany(AdvChange, {
        foreignKey: 'advOptimizationId',
        as: 'changes',
      });

      this.belongsTo(AdvOptimizationReportItem, {
        foreignKey: 'advOptimizationReportItemId',
        as: 'reportItem',
      });

      this.belongsTo(AdvOptimizationReportRule, {
        foreignKey: 'advOptimizationReportRuleId',
        as: 'rule',
      });
    }
  }

  AdvOptimization.init(
    {
      advOptimizationId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      advOptimizationBatchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      optimizableId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      optimizableType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      values: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
      },
      advOptimizationReportItemId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      advOptimizationReportRuleId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      logs: DataTypes.TEXT,
      errorMessage: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'AdvOptimization',
      tableName: 'advOptimizations',
    }
  );
  return AdvOptimization;
};
