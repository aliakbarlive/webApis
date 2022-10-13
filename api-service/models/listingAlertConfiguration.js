'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ListingAlertConfiguration extends Model {
    static associate({ Listing }) {
      this.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });
    }
  }

  ListingAlertConfiguration.init(
    {
      listingAlertConfigurationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      listingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      title: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      price: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      featureBullets: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      listingImages: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      buyboxWinner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      categories: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reviews: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lowStock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rating: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lowStockThreshold: {
        type: DataTypes.INTEGER,
        defaultValue: 50,
        set(value) {
          this.setDataValue('lowStockThreshold', value ?? 0);
        },
      },
      ratingCondition: {
        type: DataTypes.JSONB,
        defaultValue: {
          type: 'below',
          value: 3,
        },
      },
    },
    {
      sequelize,
      modelName: 'ListingAlertConfiguration',
      tableName: 'listingAlertConfigurations',
    }
  );
  return ListingAlertConfiguration;
};
