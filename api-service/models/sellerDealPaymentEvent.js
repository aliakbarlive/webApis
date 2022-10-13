'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class SellerDealPaymentEvent extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
    }
  }
  SellerDealPaymentEvent.init(
    {
      sellerDealPaymentEventId: {
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
      dealId: DataTypes.STRING,
      dealDescription: DataTypes.STRING,
      eventType: DataTypes.STRING,
      feeType: DataTypes.STRING,
      feeCurrencyCode: DataTypes.STRING,
      feeCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('feeCurrencyAmount'));
        },
      },
      taxCurrencyCode: DataTypes.STRING,
      taxCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('taxCurrencyAmount'));
        },
      },
      totalCurrencyCode: DataTypes.STRING,
      totalCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('totalCurrencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'sellerDealPaymentEvents',
      modelName: 'SellerDealPaymentEvent',
    }
  );
  return SellerDealPaymentEvent;
};
