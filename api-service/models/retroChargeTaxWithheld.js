'use strict';
const { Model } = require('sequelize');

const RetroChargeEvent = require('./retroChargeEvent');

module.exports = (sequelize, DataTypes) => {
  class RetroChargeTaxWithheld extends Model {
    static associate({ RetroChargeEvent }) {
      this.belongsTo(RetroChargeEvent, {
        foreignKey: 'retroChargeEventId',
        constraints: false,
      });
    }
  }
  RetroChargeTaxWithheld.init(
    {
      retroChargeTaxWithheldId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      retroChargeEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: RetroChargeEvent,
          key: 'retroChargeEventId',
        },
      },
      taxCollectionModel: DataTypes.STRING,
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
      tableName: 'retroChargeTaxWithhelds',
      modelName: 'RetroChargeTaxWithheld',
    }
  );
  return RetroChargeTaxWithheld;
};
