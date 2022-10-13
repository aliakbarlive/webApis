'use strict';
const { Model } = require('sequelize');

const ShipmentAdjustmentItem = require('./shipmentAdjustmentItem');

module.exports = (sequelize, DataTypes) => {
  class ItemChargeAdjustment extends Model {
    static associate({ ShipmentAdjustmentItem }) {
      this.belongsTo(ShipmentAdjustmentItem, {
        foreignKey: 'shipmentAdjustmentItemId',
        targetKey: 'shipmentAdjustmentItemId',
        constraints: false,
      });
    }
  }
  ItemChargeAdjustment.init(
    {
      itemChargeAdjustmentId: {
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
      indexes: [
        {
          unique: false,
          fields: ['orderAdjustmentItemId'],
        },
      ],
      sequelize,
      tableName: 'itemChargeAdjustments',
      modelName: 'ItemChargeAdjustment',
    }
  );
  return ItemChargeAdjustment;
};
