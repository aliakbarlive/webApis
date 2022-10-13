'use strict';
const { Model } = require('sequelize');

const Order = require('./order');
const Account = require('./account');
const Marketplace = require('./marketplace');

module.exports = (sequelize, DataTypes) => {
  class GuaranteeClaimEvent extends Model {
    static associate({ Order, ShipmentAdjustmentItem, Marketplace }) {
      this.belongsTo(Order, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.hasMany(ShipmentAdjustmentItem, {
        foreignKey: 'guaranteeEventId',
        constraints: false,
      });
      this.belongsTo(Marketplace, {
        foreignKey: 'marketplaceId',
      });
    }
  }
  GuaranteeClaimEvent.init(
    {
      guaranteeEventId: {
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
      sellerOrderId: DataTypes.STRING,
      postedDate: DataTypes.DATE,
      marketplaceId: {
        type: DataTypes.STRING,
        references: {
          model: Marketplace,
          key: 'marketplaceId',
        },
      },
      marketplaceName: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'guaranteeClaimEvents',
      modelName: 'GuaranteeClaimEvent',
    }
  );
  return GuaranteeClaimEvent;
};
