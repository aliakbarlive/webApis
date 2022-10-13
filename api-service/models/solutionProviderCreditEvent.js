'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class SolutionProviderCreditEvent extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
    }
  }
  SolutionProviderCreditEvent.init(
    {
      solutionProviderCreditEventId: {
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
      providerTransactionType: DataTypes.STRING,
      sellerOrderId: DataTypes.STRING,
      marketplaceId: DataTypes.STRING,
      marketplaceCountryCode: DataTypes.STRING,
      sellerId: DataTypes.STRING,
      sellerStoreName: DataTypes.STRING,
      providerId: DataTypes.STRING,
      providerStoreName: DataTypes.STRING,
      transactionAmountCurrencyCode: DataTypes.STRING,
      transactionAmountCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(
            this.getDataValue('transactionAmountCurrencyAmount')
          );
        },
      },
      transactionCreationDate: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'solutionProviderCreditEvents',
      modelName: 'SolutionProviderCreditEvent',
    }
  );
  return SolutionProviderCreditEvent;
};
