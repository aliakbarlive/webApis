'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class RemovalShipmentEvent extends Model {
    static associate({ Account, RemovalShipmentItem }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
      this.hasMany(RemovalShipmentItem, {
        foreignKey: 'removalShipmentEventId',
        constraints: false,
      });
    }
  }
  RemovalShipmentEvent.init(
    {
      removalShipmentEventId: {
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
      postedDate: DataTypes.DATE,
      orderId: DataTypes.STRING,
      transactionType: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'removalShipmentEvents',
      modelName: 'RemovalShipmentEvent',
    }
  );
  return RemovalShipmentEvent;
};
