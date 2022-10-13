'use strict';
const { Model } = require('sequelize');

const DebtRecoveryEvent = require('./debtRecoveryEvents');

module.exports = (sequelize, DataTypes) => {
  class ChargeInstrument extends Model {
    static associate({ DebtRecoveryEvent }) {
      this.belongsTo(DebtRecoveryEvent, {
        foreignKey: 'debtRecoveryEventId',
        constraints: false,
      });
    }
  }
  ChargeInstrument.init(
    {
      chargeInstrumentId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      debtRecoveryEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: DebtRecoveryEvent,
          key: 'debtRecoveryEventId',
        },
      },
      tail: DataTypes.STRING,
      currencyCode: DataTypes.STRING,
      currencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('currencyAmount'));
        },
      },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: 'chargeInstruments',
      modelName: 'ChargeInstrument',
    }
  );
  return ChargeInstrument;
};
