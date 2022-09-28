'use strict';
const { Model } = require('sequelize');
const AdvProductAd = require('./advProductAd');

module.exports = (sequelize, DataTypes) => {
  class AdvProductAdRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvProductAd }) {
      this.belongsTo(AdvProductAd, {
        foreignKey: 'advProductAdId',
        constraints: false,
      });
    }
  }
  AdvProductAdRecord.init(
    {
      advProductAdId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: AdvProductAd,
          key: 'advProductAdId',
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true,
      },
      impressions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      cost: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions1d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions7d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions30d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions1dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions7dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions14dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedConversions30dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered1d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered7d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered30d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales1d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales7d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales30d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales1dSameSKU: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales7dSameSKU: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales14dSameSKU: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSales30dSameSKU: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered1dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered7dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered14dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrdered30dSameSKU: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedDPV14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsSold14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedDetailPageViewsClicks14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedOrdersNewToBrand14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedOrdersNewToBrandPercentage14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedOrderRateNewToBrand14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSalesNewToBrand14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedSalesNewToBrandPercentage14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrderedNewToBrand14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedUnitsOrderedNewToBrandPercentage14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      unitsSold14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      dpv14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      sales: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      unitsSold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      viewAttributedConversions14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      viewAttributedDetailPageView14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      viewAttributedSales14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      viewAttributedUnitsOrdered14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      viewImpressions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      viewAttributedOrdersNewToBrand14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      viewAttributedSalesNewToBrand14d: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
      },
      viewAttributedUnitsOrderedNewToBrand14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attributedBrandedSearches14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      viewAttributedBrandedSearches14d: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['advProductAdId'],
        },
        {
          unique: false,
          fields: ['date'],
        },
      ],
      sequelize,
      modelName: 'AdvProductAdRecord',
      tableName: 'advProductAdRecords',
      timestamps: false,
    }
  );
  return AdvProductAdRecord;
};
