'use strict';
const { Model } = require('sequelize');

const RemovalShipmentEvent = require('./removalShipmentEvent');

module.exports = (sequelize, DataTypes) => {
  class RemovalShipmentItem extends Model {
    static associate({ RemovalShipmentEvent }) {
      this.belongsTo(RemovalShipmentEvent, {
        foreignKey: 'removalShipmentEventId',
        constraints: false,
      });
    }
  }
  RemovalShipmentItem.init(
    {
      removalShipmentItemId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      removalShipmentEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: RemovalShipmentEvent,
          key: 'removalShipmentEventId',
        },
      },
      taxCollectionModel: DataTypes.STRING,
      fulfillmentNetworkSKU: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      revenueCurrencyCode: DataTypes.STRING,
      revenueCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('revenueCurrencyAmount'));
        },
      },
      feeCurrencyCode: DataTypes.STRING,
      feeCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('feeCurrencyAmount'));
        },
      },
      taxCurrencyCode: DataTypes.STRING,
      taxCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('taxCurrencyAmount'));
        },
      },
      taxWithheldCurrencyCode: DataTypes.STRING,
      taxWithheldCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('taxWithheldCurrencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'removalShipmentItems',
      modelName: 'RemovalShipmentItem',
    }
  );
  return RemovalShipmentItem;
};
