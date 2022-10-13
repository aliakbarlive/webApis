'use strict';
const { Model } = require('sequelize');

const ShipmentAdjustmentItem = require('./shipmentAdjustmentItem');

module.exports = (sequelize, DataTypes) => {
  class ItemFeeAdjustment extends Model {
    static associate({ ShipmentAdjustmentItem }) {
      this.belongsTo(ShipmentAdjustmentItem, {
        foreignKey: 'shipmentAdjustmentItemId',
        targetKey: 'shipmentAdjustmentItemId',
        constraints: false,
      });
    }
  }
  ItemFeeAdjustment.init(
    {
      itemFeeAdjustmentId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      shipmentAdjustmentItemId: {
        type: DataTypes.BIGINT,
        references: {
          model: ShipmentAdjustmentItem,
          key: 'shipmentAdjustmentItemId',
        },
      },
      orderAdjustmentItemId: DataTypes.STRING,
      chargeType: DataTypes.STRING,
      currencyCode: DataTypes.STRING,
      currencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('currencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'itemFeeAdjustments',
      modelName: 'ItemFeeAdjustment',
    }
  );
  return ItemFeeAdjustment;
};
