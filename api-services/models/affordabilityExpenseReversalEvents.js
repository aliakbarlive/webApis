'use strict';
const { Model } = require('sequelize');

const Order = require('./order');
const Account = require('./account');
const Marketplace = require('./marketplace');

module.exports = (sequelize, DataTypes) => {
  class AffordabilityExpenseReversalEvent extends Model {
    static associate({ Order }) {
      this.belongsTo(Order, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
    }
  }
  AffordabilityExpenseReversalEvent.init(
    {
      affordabilityExpenseReversalEventId: {
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
      amazonOrderId: {
        type: DataTypes.STRING,
        references: {
          model: Order,
          key: 'amazonOrderId',
        },
      },
      postedDate: DataTypes.DATE,
      marketplaceId: {
        type: DataTypes.STRING,
        references: {
          model: Marketplace,
          key: 'marketplaceId',
        },
      },
      transactionType: DataTypes.STRING,
      baseExpenseCurrencyCode: DataTypes.STRING,
      baseExpenseCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('baseExpenseCurrencyAmount'));
        },
      },
      taxTypeCGSTCurrencyCode: DataTypes.STRING,
      taxTypeCGSTCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('taxTypeCGSTCurrencyAmount'));
        },
      },
      taxTypeSGSTCurrencyCode: DataTypes.STRING,
      taxTypeSGSTCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('taxTypeSGSTCurrencyAmount'));
        },
      },
      taxTypeIGSTCurrencyCode: DataTypes.STRING,
      taxTypeIGSTCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('taxTypeIGSTCurrencyAmount'));
        },
      },
      totalExpenseCurrencyCode: DataTypes.STRING,
      totalExpenseCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('totalExpenseCurrencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'affordabilityExpenseReversalEvents',
      modelName: 'AffordabilityExpenseReversalEvent',
    }
  );
  return AffordabilityExpenseReversalEvent;
};
