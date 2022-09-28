'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate({
      Account,
      Listing,
      InventoryItem,
      AdvProductAd,
      OrderItem,
      Note,
      TagRecord,
    }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        sourceKey: 'accountId',
        constraints: false,
      });
      this.hasMany(Listing, { foreignKey: 'asin', as: 'listings' });
      this.hasMany(Listing, {
        foreignKey: 'groupedAsin',
        as: 'listingChild',
        constraints: false,
      });

      this.hasMany(AdvProductAd, {
        foreignKey: 'asin',
        constraints: false,
      });

      this.hasMany(OrderItem, {
        foreignKey: 'asin',
        constraints: false,
      });

      this.hasMany(InventoryItem, {
        foreignKey: 'asin',
        constraints: false,
        as: 'inventoryItems',
      });

      this.hasMany(Note, {
        foreignKey: 'asin',
        constraints: false,
      });

      this.hasMany(TagRecord, {
        foreignKey: 'asin',
        constraints: false,
      });
    }
  }
  Product.init(
    {
      asin: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'accountId',
        },
      },
      parent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      listing: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
    }
  );
  return Product;
};
