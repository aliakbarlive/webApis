'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class DebtRecoveryEvent extends Model {
    static associate({ Account, ChargeInstrument, DebtRecoveryItem }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
      this.hasMany(ChargeInstrument, {
        foreignKey: 'debtRecoveryEventId',
        constraints: false,
      });
      this.hasMany(DebtRecoveryItem, {
        foreignKey: 'debtRecoveryEventId',
        constraints: false,
      });
    }
  }
  DebtRecoveryEvent.init(
    {
      debtRecoveryEventId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Account,
          key: 'accountId',
        },
      },
      recoveryCurrencyCode: DataTypes.STRING,
      recoveryCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('recoveryCurrencyAmount'));
        },
      },
      overPaymentCreditCurrencyCode: DataTypes.STRING,
      overPaymentCreditCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(
            this.getDataValue('overPaymentCreditCurrencyAmount')
          );
        },
      },
      debtRecoveryType: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'debtRecoveryEvents',
      modelName: 'DebtRecoveryEvent',
    }
  );
  return DebtRecoveryEvent;
};
