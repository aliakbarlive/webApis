'use strict';
const { Model } = require('sequelize');
const AdjustmentEvent = require('./adjustmentEvents');

module.exports = (sequelize, DataTypes) => {
  class AdjustmentItem extends Model {
    static associate({ AdjustmentEvent }) {
      this.belongsTo(AdjustmentEvent, {
        foreignKey: 'adjustmentEventId',
        constraints: false,
      });
    }
  }
  AdjustmentItem.init(
    {
      adjustmentItemId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      adjustmentEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: AdjustmentEvent,
          key: 'adjustmentEventId',
        },
      },
      asin: DataTypes.STRING,
      sellerSku: DataTypes.STRING,
      fnSku: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      totalCurrencyCode: DataTypes.STRING,
      totalCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('totalCurrencyAmount'));
        },
      },
      perUnitCurrencyCode: DataTypes.STRING,
      perUnitCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('perUnitCurrencyAmount'));
        },
      },
      productDescription: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: 'adjustmentItems',
      modelName: 'AdjustmentItem',
    }
  );
  return AdjustmentItem;
};
