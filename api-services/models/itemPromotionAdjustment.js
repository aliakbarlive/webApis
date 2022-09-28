'use strict';
const { Model } = require('sequelize');

const ShipmentAdjustmentItem = require('./shipmentAdjustmentItem');

module.exports = (sequelize, DataTypes) => {
  class ItemPromotionAdjustment extends Model {
    static associate({ ShipmentAdjustmentItem }) {
      this.belongsTo(ShipmentAdjustmentItem, {
        foreignKey: 'shipmentAdjustmentItemId',
        constraints: false,
      });
    }
  }
  ItemPromotionAdjustment.init(
    {
      itemPromotionAdjustmentId: {
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
      promotionId: DataTypes.STRING,
      promotionType: DataTypes.STRING,
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
      tableName: 'itemPromotionAdjustments',
      modelName: 'ItemPromotionAdjustment',
    }
  );
  return ItemPromotionAdjustment;
};
