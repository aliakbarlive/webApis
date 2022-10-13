'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvOptimizationReportItem extends Model {
    static associate({
      AdvOptimizationReport,
      AdvOptimizationReportItemOption,
    }) {
      this.belongsTo(AdvOptimizationReport, {
        foreignKey: 'advOptimizationReportId',
        as: 'optimizationReport',
      });

      this.hasMany(AdvOptimizationReportItemOption, {
        foreignKey: 'advOptimizationReportItemId',
        as: 'options',
      });
    }
  }

  AdvOptimizationReportItem.init(
    {
      advOptimizationReportItemId: {
        allowNull: false,
        type: DataTypes.STRING,
        primaryKey: true,
      },
      advOptimizationReportId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      advCampaignId: {
        type: DataTypes.BIGINT,
      },
      advAdGroupId: {
        type: DataTypes.BIGINT,
      },
      advProductAdId: {
        type: DataTypes.BIGINT,
      },
      advTargetId: {
        type: DataTypes.BIGINT,
      },
      advKeywordId: {
        type: DataTypes.BIGINT,
      },
      advSearchTermId: {
        type: DataTypes.BIGINT,
      },
      values: {
        type: DataTypes.JSONB,
      },
      previousData: {
        type: DataTypes.JSONB,
      },
      previousDataDateRange: {
        type: DataTypes.JSONB,
      },
      acos: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      cpc: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      cr: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      ctr: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      profit: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      impressions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      cost: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedConversions1d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedConversions7d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedConversions14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedConversions30d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedConversions1dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedConversions7dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedConversions14dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedConversions30dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered1d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered7d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered30d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedSales1d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedSales7d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedSales14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedSales30d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedSales1dSameSKU: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedSales7dSameSKU: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedSales14dSameSKU: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedSales30dSameSKU: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedUnitsOrdered1dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered7dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered14dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrdered30dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedDPV14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsSold14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedDetailPageViewsClicks14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedOrdersNewToBrand14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedOrdersNewToBrandPercentage14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedOrderRateNewToBrand14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedSalesNewToBrand14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedSalesNewToBrandPercentage14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      attributedUnitsOrderedNewToBrand14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attributedUnitsOrderedNewToBrandPercentage14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      unitsSold14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      dpv14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      unitsSold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      cpm: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      cpcon: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      sales: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      aov: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      roas: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'AdvOptimizationReportItem',
      tableName: 'advOptimizationReportItems',
      timestamps: false,
    }
  );
  return AdvOptimizationReportItem;
};
