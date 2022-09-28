'use strict';
const { Model } = require('sequelize');

const Account = require('./account');
const Marketplace = require('./marketplace');

module.exports = (sequelize, DataTypes) => {
  class RetroChargeEvent extends Model {
    static associate({ Account, RetroChargeTaxWithheld }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
      this.hasMany(RetroChargeTaxWithheld, {
        foreignKey: 'retroChargeEventId',
        constraints: false,
      });
    }
  }
  RetroChargeEvent.init(
    {
      retroChargeEventId: {
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
      marketplaceId: {
        type: DataTypes.STRING,
        references: {
          model: Marketplace,
          key: 'marketplaceId',
        },
      },
      marketplaceName: DataTypes.STRING,
      postedDate: DataTypes.DATE,
      baseTaxCurrencyCode: DataTypes.STRING,
      baseTaxCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('baseTaxCurrencyAmount'));
        },
      },
      shippingTaxCurrencyCode: DataTypes.STRING,
      shippingTaxCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('baseTaxCurrencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'retroChargeEvents',
      modelName: 'RetroChargeEvent',
    }
  );
  return RetroChargeEvent;
};
