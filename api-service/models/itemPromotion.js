'use strict';
const { Model } = require('sequelize');

const ShipmentItem = require('./shipmentitem');

module.exports = (sequelize, DataTypes) => {
  class ItemPromotion extends Model {
    static associate({ ShipmentItem }) {
      this.belongsTo(ShipmentItem, {
        foreignKey: 'shipmentItemId',
        sourceKey: 'shipmentItemId',
        constraints: false,
        allowNull: false,
      });
    }
  }
  ItemPromotion.init(
    {
      itemPromotionId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      shipmentItemId: {
        type: DataTypes.BIGINT,
        references: {
          model: ShipmentItem,
          key: 'shipmentItemId',
        },
      },
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
      tableName: 'itemPromotions',
      modelName: 'ItemPromotion',
    }
  );
  return ItemPromotion;
};
