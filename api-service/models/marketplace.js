'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Marketplace extends Model {
    static associate({
      Account,
      AccountMarketplace,
      Listing,
      InventoryItem,
      Tag,
    }) {
      this.hasMany(Listing, { foreignKey: 'marketplaceId' });

      this.hasMany(InventoryItem, { foreignKey: 'marketplaceId' });

      // this.belongsToMany(Account, {
      //   through: AccountMarketplace,
      //   foreignKey: 'marketplaceId',
      //   as: 'accounts',
      // });

      this.hasMany(AccountMarketplace, {
        foreignKey: 'accountId',
        as: 'accounts',
      });

      this.hasMany(Tag, { foreignKey: 'marketplaceId', constraints: false });
    }
  }
  Marketplace.init(
    {
      marketplaceId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
      },
      countryCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      defaultCurrencyCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      defaultLanguageCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domainName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAllowed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Marketplace',
      tableName: 'marketplaces',
      timestamps: false,
      scopes: {
        allowed: {
          where: {
            isAllowed: true,
          },
        },
      },
    }
  );
  return Marketplace;
};
