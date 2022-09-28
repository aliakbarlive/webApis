'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class SellerReviewEnrollmentPaymentEvent extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
    }
  }
  SellerReviewEnrollmentPaymentEvent.init(
    {
      sellerReviewEnrollmentPaymentEventId: {
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
      parentAsin: DataTypes.STRING,
      postedDate: DataTypes.DATE,
      totalCurrencyCode: DataTypes.STRING,
      totalCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('totalCurrencyAmount'));
        },
      },
      enrollmentId: DataTypes.STRING,
      feeType: DataTypes.STRING,
      feeCurrencyCode: DataTypes.STRING,
      feeCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('feeCurrencyAmount'));
        },
      },
      chargeType: DataTypes.STRING,
      chargeCurrencyCode: DataTypes.STRING,
      chargeCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('chargeCurrencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'sellerReviewEnrollmentPaymentEvents',
      modelName: 'SellerReviewEnrollmentPaymentEvent',
    }
  );
  return SellerReviewEnrollmentPaymentEvent;
};
