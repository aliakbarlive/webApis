'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class ProductAdsPaymentEvent extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
    }
  }
  ProductAdsPaymentEvent.init(
    {
      productAdsPaymentId: {
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
      invoiceId: DataTypes.STRING,
      postedDate: DataTypes.DATE,
      taxValueCurrencyCode: DataTypes.STRING,
      taxValueCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('taxValueCurrencyAmount'));
        },
      },
      baseCurrencyCode: DataTypes.STRING,
      baseCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('baseCurrencyAmount'));
        },
      },
      transactionType: DataTypes.STRING,
      transactionCurrencyCode: DataTypes.STRING,
      transactionCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('transactionCurrencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'productAdsPaymentEvents',
      modelName: 'ProductAdsPaymentEvent',
    }
  );
  return ProductAdsPaymentEvent;
};
