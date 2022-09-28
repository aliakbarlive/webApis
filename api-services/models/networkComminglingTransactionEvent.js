'use strict';
const { Model } = require('sequelize');

const Account = require('./account');
const Marketplace = require('./marketplace');

module.exports = (sequelize, DataTypes) => {
  class NetworkComminglingTransactionEvent extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
    }
  }
  NetworkComminglingTransactionEvent.init(
    {
      networkComminglingTransactionEventId: {
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
      transactionType: DataTypes.STRING,
      postedDate: DataTypes.DATE,
      netCoTransactionId: DataTypes.STRING,
      swapReason: DataTypes.STRING,
      asin: DataTypes.STRING,
      marketplaceId: {
        type: DataTypes.STRING,
        references: {
          model: Marketplace,
          key: 'marketplaceId',
        },
      },
      taxExclusiveCurrencyCode: DataTypes.STRING,
      taxExclusiveCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('taxExclusiveCurrencyAmount'));
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
    },
    {
      sequelize,
      tableName: 'networkComminglingTransactionEvents',
      modelName: 'NetworkComminglingTransactionEvent',
    }
  );
  return NetworkComminglingTransactionEvent;
};
