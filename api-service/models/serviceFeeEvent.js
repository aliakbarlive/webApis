'use strict';
const { Model } = require('sequelize');

const Order = require('./order');
const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class ServiceFeeEvent extends Model {
    static associate({ Account, Order, ItemFee }) {
      this.belongsTo(Order, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.belongsTo(Account, { foreignKey: 'accountId' });
      this.hasMany(ItemFee, {
        foreignKey: 'serviceFeeEventId',
        constraints: false,
      });
    }
  }
  ServiceFeeEvent.init(
    {
      serviceFeeEventId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      amazonOrderId: {
        type: DataTypes.STRING,
        references: {
          model: Order,
          key: 'amazonOrderId',
        },
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Account,
          key: 'accountId',
        },
      },
      sellerSku: DataTypes.STRING,
      fnSku: DataTypes.STRING,
      feeDescription: DataTypes.TEXT,
      asin: DataTypes.STRING,
      feeReason: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'serviceFeeEvents',
      modelName: 'ServiceFeeEvent',
    }
  );
  return ServiceFeeEvent;
};
