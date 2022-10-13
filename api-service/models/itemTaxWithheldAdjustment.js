'use strict';
const { Model } = require('sequelize');

const ShipmentAdjustmentItem = require('./shipmentAdjustmentItem');

module.exports = (sequelize, DataTypes) => {
  class ItemTaxWithheldAdjustment extends Model {
    static associate({ ShipmentAdjustmentItem }) {
      this.belongsTo(ShipmentAdjustmentItem, {
        foreignKey: 'shipmentAdjustmentItemId',
        constraints: false,
      });
    }
  }
  ItemTaxWithheldAdjustment.init(
    {
      itemTaxWithheldAdjustmentId: {
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
      taxCollectionModel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
      tableName: 'itemTaxWithheldAdjustments',
      modelName: 'ItemTaxWithheldAdjustment',
    }
  );
  return ItemTaxWithheldAdjustment;
};
