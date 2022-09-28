'use strict';
const { Model } = require('sequelize');

const Order = require('./order');
const Account = require('./account');
const Marketplace = require('./marketplace');

module.exports = (sequelize, DataTypes) => {
  class RentalTransactionEvent extends Model {
    static associate({ Order, ItemCharge, ItemFee }) {
      this.belongsTo(Order, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.hasMany(ItemCharge, {
        foreignKey: 'rentalTransactionId',
        constraints: false,
      });
      this.hasMany(ItemFee, {
        foreignKey: 'rentalTransactionId',
        constraints: false,
      });
    }
  }
  RentalTransactionEvent.init(
    {
      rentalTransactionId: {
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
      amazonOrderId: {
        type: DataTypes.STRING,
        references: {
          model: Order,
          key: 'amazonOrderId',
        },
      },
      rentalEventType: DataTypes.STRING,
      extensionLength: DataTypes.INTEGER,
      postedDate: DataTypes.DATE,
      marketplaceId: {
        type: DataTypes.STRING,
        references: {
          model: Marketplace,
          key: 'marketplaceId',
        },
      },
      marketplaceName: DataTypes.STRING,
      rentalInitialValueCurrencyCode: DataTypes.STRING,
      rentalInitialValueCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(
            this.getDataValue('rentalInitialValueCurrencyAmount')
          );
        },
      },
      rentalReimbursementCurrencyCode: DataTypes.STRING,
      rentalReimbursementCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(
            this.getDataValue('rentalReimbursementCurrencyAmount')
          );
        },
      },
    },
    {
      sequelize,
      tableName: 'rentalTransactionEvents',
      modelName: 'RentalTransactionEvent',
    }
  );
  return RentalTransactionEvent;
};
