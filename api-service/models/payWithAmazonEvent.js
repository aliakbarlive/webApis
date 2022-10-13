'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class PayWithAmazonEvent extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
    }
  }
  PayWithAmazonEvent.init(
    {
      payWithAmazonEventId: {
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
      sellerOrderId: DataTypes.STRING,
      transactionPostedDate: DataTypes.DATE,
      businessObjectType: DataTypes.STRING,
      salesChannel: DataTypes.STRING,
      paymentAmountType: DataTypes.STRING,
      amountDescription: DataTypes.STRING,
      fulfillmentChannel: DataTypes.STRING,
      storeName: DataTypes.STRING,
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
      tableName: 'payWithAmazonEvents',
      modelName: 'PayWithAmazonEvent',
    }
  );
  return PayWithAmazonEvent;
};
