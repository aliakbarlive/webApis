'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class CouponPaymentEvent extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
    }
  }
  CouponPaymentEvent.init(
    {
      couponPaymentId: {
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
      couponId: DataTypes.STRING,
      postedDate: DataTypes.DATE,
      totalCurrencyCode: DataTypes.STRING,
      totalCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('totalCurrencyAmount'));
        },
      },
      feeType: DataTypes.STRING,
      feeCurrencyCode: DataTypes.STRING,
      feeCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('feeCurrencyAmount'));
        },
      },
      paymentEventId: DataTypes.STRING,
      chargeType: DataTypes.STRING,
      chargeCurrencyCode: DataTypes.STRING,
      chargeCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('chargeCurrencyAmount'));
        },
      },
      clipOrRedemptionCount: DataTypes.INTEGER,
      sellerCouponDescription: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'couponPaymentEvents',
      modelName: 'CouponPaymentEvent',
    }
  );
  return CouponPaymentEvent;
};
