'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdvOptimizationBatch extends Model {
    static associate({ User, AdvProfile, AdvOptimization, AdvChangeRequest }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
      });

      this.belongsTo(AdvProfile, {
        foreignKey: 'advProfileId',
        as: 'advProfile',
      });

      this.hasMany(AdvOptimization, {
        foreignKey: 'advOptimizationBatchId',
        as: 'optimizations',
      });

      this.belongsTo(AdvChangeRequest, {
        foreignKey: 'advChangeRequestId',
        as: 'changeRequest',
      });
    }
  }
  AdvOptimizationBatch.init(
    {
      advOptimizationBatchId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      advProfileId: {
        type: DataTypes.BIGINT,
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
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      advChangeRequestId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      advOptimizationReportId: {
        type: DataTypes.INTEGER,
      },
      processedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'AdvOptimizationBatch',
      tableName: 'advOptimizationBatches',
    }
  );
  return AdvOptimizationBatch;
};
