'use strict';
const { Model } = require('sequelize');

const DebtRecoveryEvent = require('./debtRecoveryEvents');

module.exports = (sequelize, DataTypes) => {
  class DebtRecoveryItem extends Model {
    static associate({ DebtRecoveryEvent }) {
      this.belongsTo(DebtRecoveryEvent, {
        foreignKey: 'debtRecoveryEventId',
        constraints: false,
      });
    }
  }
  DebtRecoveryItem.init(
    {
      debtRecoveryItemId: {
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
      groupEndDate: DataTypes.DATE,
      groupBeginDate: DataTypes.DATE,
      originalCurrencyCode: DataTypes.STRING,
      originalCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('originalCurrencyAmount'));
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
    },
    {
      sequelize,
      tableName: 'debtRecoveryItems',
      modelName: 'DebtRecoveryItem',
    }
  );
  return DebtRecoveryItem;
};
