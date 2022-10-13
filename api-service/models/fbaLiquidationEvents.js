'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class FbaLiquidationEvent extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
    }
  }
  FbaLiquidationEvent.init(
    {
      fbaLiquidationEventId: {
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
      postedDate: DataTypes.DATE,
      originalRemovalOrderId: DataTypes.STRING,
      liquidationProceedsCurrencyCode: DataTypes.STRING,
      liquidationProceedsCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(
            this.getDataValue('liquidationProceedsCurrencyAmount')
          );
        },
      },
      liquidationFeeCurrencyCode: DataTypes.STRING,
      liquidationFeeCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('liquidationFeeCurrencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'fbaLiquidationEvents',
      modelName: 'FbaLiquidationEvent',
    }
  );
  return FbaLiquidationEvent;
};
