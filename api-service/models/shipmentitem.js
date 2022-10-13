'use strict';
const { Model } = require('sequelize');

const ShipmentEvent = require('./shipmentEvent');
const InventoryItem = require('./inventoryItem');

module.exports = (sequelize, DataTypes) => {
  class ShipmentItem extends Model {
    static associate({
      ShipmentEvent,
      InventoryItem,
      Product,
      ItemCharge,
      ItemFee,
      ItemWithheldTax,
      ItemPromotion,
    }) {
      this.belongsTo(ShipmentEvent, {
        foreignKey: 'shipmentEventId',
        sourceKey: 'shipmentEventId',
        constraints: false,
      });
      this.belongsTo(InventoryItem, {
        foreignKey: 'sellerSku',
        sourceKey: 'sellerSku',
        as: 'inventoryItem',
      });
      this.hasMany(ItemCharge, {
        foreignKey: 'shipmentItemId',
        constraints: false,
      });
      this.hasMany(ItemFee, {
        foreignKey: 'shipmentItemId',
        constraints: false,
      });
      this.hasMany(ItemWithheldTax, {
        foreignKey: 'shipmentItemId',
        constraints: false,
      });
      this.hasMany(ItemPromotion, {
        foreignKey: 'shipmentItemId',
        constraints: false,
      });
    }
  }
  ShipmentItem.init(
    {
      shipmentItemId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      shipmentEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: ShipmentEvent,
          key: 'shipmentEventId',
        },
      },
      orderItemId: DataTypes.STRING,
      amazonOrderId: DataTypes.STRING,
      sellerSku: {
        type: DataTypes.STRING,
        foreignKey: true,
        references: {
          model: InventoryItem,
          key: 'sellerSku',
        },
      },
      quantityShipped: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['amazonOrderId'],
        },
      ],
      sequelize,
      tableName: 'shipmentItems',
      modelName: 'ShipmentItem',
    }
  );
  return ShipmentItem;
};
