'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class LoanServicingEvent extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
    }
  }
  LoanServicingEvent.init(
    {
      loanServicingEventId: {
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
      loanCurrencyCode: DataTypes.STRING,
      loanCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('loanCurrencyAmount'));
        },
      },
      sourceBusinessEventType: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'loanServicingEvents',
      modelName: 'LoanServicingEvent',
    }
  );
  return LoanServicingEvent;
};
