'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InventoryItem extends Model {
    static associate({
      Account,
      Product,
      Marketplace,
      Note,
      TagRecord,
      ProductCost,
      ShipmentItem,
      Listing,
      InventoryDetail,
    }) {
      this.belongsTo(Account, { foreignKey: 'accountId' });
      this.belongsTo(Listing, { foreignKey: 'asin', targetKey: 'asin' });
      this.belongsTo(Product, {
        foreignKey: 'asin',
        targetKey: 'asin',
        as: 'product',
      });
      this.belongsTo(Marketplace, { foreignKey: 'marketplaceId' });
      this.hasMany(ProductCost, { foreignKey: 'inventoryItemId', as: 'costs' });
      this.hasMany(ShipmentItem, {
        foreignKey: 'sellerSku',
        sourceKey: 'sellerSku',
        as: 'shipmentItems',
      });
      this.hasMany(Note, {
        foreignKey: 'inventoryItemId',
        constraints: false,
      });
      this.hasMany(TagRecord, {
        foreignKey: 'inventoryItemId',
        constraints: false,
      });
      this.hasOne(InventoryDetail, {
        foreignKey: 'inventoryItemId',
        constraints: false,
        as: 'details',
      });
    }
  }
  InventoryItem.init(
    {
      inventoryItemId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        get() {
          return parseInt(this.getDataValue('inventoryItemId'));
        },
      },
      asin: {
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      marketplaceId: {
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true,
      },
      defaultCog: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('defaultCog'));
        },
      },
      sellerSku: {
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true,
      },
      fnSku: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING,
      },
      condition: {
        type: DataTypes.STRING,
      },
      lastUpdatedTime: {
        type: DataTypes.DATE,
      },
      totalQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        get() {
          return parseInt(this.getDataValue('totalQuantity'));
        },
      },
      estCogValue: {
        type: DataTypes.VIRTUAL,
        get() {
          return parseFloat(this.defaultCog * this.totalQuantity);
        },
        set(value) {
          throw new Error('Do not try to set the `estCogValue` value!');
        },
      },
      leadTime: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
      },
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['sellerSku'],
        },
      ],
      sequelize,
      modelName: 'InventoryItem',
      tableName: 'inventoryItems',
    }
  );

  return InventoryItem;
};
