'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BillingCurrency extends Model {
    static associate(models) {
      // define association here
    }
  }
  BillingCurrency.init(
    {
      pricebookId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      currencyId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currencyCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'BillingCurrency',
      tableName: 'billingCurrencies',
    }
  );
  return BillingCurrency;
};
