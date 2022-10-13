'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    static ALERT_CHANGES_IN = [
      'title',
      'link',
      'price',
      'description',
      'featureBullets',
      'listingImages',
      'categories',
      'buyboxWinner',
      'parent_asin',
      'keywords',
    ];

    static associate({
      Product,
      Marketplace,
      KeywordRanking,
      Review,
      CategoryRanking,
      Rating,
      InventoryItem,
      ListingChanges,
      ListingAlertConfiguration,
    }) {
      this.belongsTo(Product, { foreignKey: 'asin', as: 'product' });
      this.belongsTo(Product, {
        foreignKey: 'asin',
        as: 'productParent',
      });
      this.hasMany(InventoryItem, {
        foreignKey: 'asin',
        sourceKey: 'asin',
      });
      this.belongsTo(Marketplace, { foreignKey: 'marketplaceId' });

      this.hasMany(KeywordRanking, { foreignKey: 'listingId' });
      this.hasMany(ListingChanges, { foreignKey: 'listingId' });
      this.hasMany(CategoryRanking, { foreignKey: 'listingId' });
      this.hasOne(Rating, { foreignKey: 'listingId' });

      this.hasMany(Review, {
        foreignKey: 'listingId',
      });

      this.hasOne(ListingAlertConfiguration, {
        foreignKey: 'listingId',
        as: 'alertConfiguration',
      });
    }
  }
  Listing.init(
    {
      listingId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      asin: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'products',
          key: 'asin',
        },
      },
      groupedAsin: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      marketplaceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
      },
      keywords: {
        type: DataTypes.STRING,
      },
      parent_asin: {
        type: DataTypes.STRING,
      },
      link: {
        type: DataTypes.STRING,
      },
      brand: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: DataTypes.DECIMAL,
      quantity: DataTypes.INTEGER,
      status: DataTypes.STRING,
      featureBullets: DataTypes.JSON,
      listingImages: {
        type: DataTypes.JSONB,
        set(value) {
          this.setDataValue('listingImages', value);
          if (value && Array.isArray(value) && value.length) {
            this.setDataValue('thumbnail', value[0].link);
          }
        },
      },
      thumbnail: {
        type: DataTypes.TEXT,
        defaultValue:
          'https://images-na.ssl-images-amazon.com/images/I/01RmK%2BJ4pJL.gif',
      },
      buyboxWinner: DataTypes.TEXT,
      categories: DataTypes.JSONB,
      reviewsTotal: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'listings',
      modelName: 'Listing',
    }
  );

  Listing.afterCreate(async (listing, options) => {
    await listing.createAlertConfiguration();
  });

  Listing.beforeUpdate(async (listing, options) => {
    try {
      if (listing.changed()) {
        for (let dataType of listing.changed()) {
          if (
            listing._previousDataValues[dataType] != null &&
            Listing.ALERT_CHANGES_IN.includes(dataType)
          ) {
            await sequelize.models.ListingChanges.create({
              dataType,
              listingId: listing.listingId,
              data: {
                newVal: listing.dataValues[dataType],
                oldVal: listing._previousDataValues[dataType],
              },
            });
          }
        }
      }
    } catch (error) {
      console.log('Error on listing before hook:', error.message);
    }
  });
  return Listing;
};
