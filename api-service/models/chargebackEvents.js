'use strict';
const { Model } = require('sequelize');

const Order = require('./order');
const Account = require('./account');
const Marketplace = require('./marketplace');

module.exports = (sequelize, DataTypes) => {
  class ChargebackEvent extends Model {
    static associate({ Order, ShipmentAdjustmentItem, Marketplace }) {
      this.belongsTo(Order, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.hasMany(ShipmentAdjustmentItem, {
        foreignKey: 'chargebackEventId',
        constraints: false,
      });
      this.belongsTo(Marketplace, {
        foreignKey: 'marketplaceId',
      });
    }
  }
  ChargebackEvent.init(
    {
      chargebackEventId: {
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
      sellerOrderId: DataTypes.STRING,
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
      postedDate: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      tableName: 'chargebackEvents',
      modelName: 'ChargebackEvent',
    }
  );
  return ChargebackEvent;
};
