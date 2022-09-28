'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdvOptimizationReport extends Model {
    static associate({
      User,
      AdvProfile,
      AdvOptimizationReportItem,
      AdvOptimizationReportRule,
    }) {
      this.belongsTo(User, {
        foreignKey: 'generatedByUserId',
        as: 'generatedBy',
      });

      this.belongsTo(AdvProfile, {
        foreignKey: 'advProfileId',
        as: 'advProfile',
      });

      this.hasMany(AdvOptimizationReportItem, {
        foreignKey: 'advOptimizationReportId',
        as: 'items',
      });

      this.hasMany(AdvOptimizationReportRule, {
        foreignKey: 'advOptimizationReportId',
        as: 'rules',
      });
    }
  }
  AdvOptimizationReport.init(
    {
      advOptimizationReportId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      generatedByUserId: {
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
    },
    {
      sequelize,
      modelName: 'AdvOptimizationReport',
      tableName: 'advOptimizationReports',
    }
  );
  return AdvOptimizationReport;
};
