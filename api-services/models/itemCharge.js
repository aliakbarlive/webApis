'use strict';
const { Model } = require('sequelize');

const ShipmentItem = require('./shipmentitem');
const SAFETReimbursementItem = require('./safetReimbursementItem');
const RentalTransactionEvent = require('./rentalTransactionEvent');

module.exports = (sequelize, DataTypes) => {
  class ItemCharge extends Model {
    static associate({
      ShipmentItem,
      SAFETReimbursementItem,
      RentalTransactionEvent,
    }) {
      this.belongsTo(ShipmentItem, {
        foreignKey: 'shipmentItemId',
        sourceKey: 'shipmentItemId',
        constraints: false,
        allowNull: false,
      });
      this.belongsTo(SAFETReimbursementItem, {
        foreignKey: 'safetReimbursementItemId',
        constraints: false,
      });
      this.belongsTo(RentalTransactionEvent, {
        foreignKey: 'rentalTransactionId',
        constraints: false,
      });
    }
  }
  ItemCharge.init(
    {
      itemChargeId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      shipmentItemId: {
        type: DataTypes.BIGINT,
        references: {
          model: ShipmentItem,
          key: 'shipmentItemId',
        },
      },
      safetReimbursementItemId: {
        type: DataTypes.BIGINT,
        references: {
          model: SAFETReimbursementItem,
          key: 'safetReimbursementItemId',
        },
      },
      rentalTransactionId: {
        type: DataTypes.BIGINT,
        references: {
          model: RentalTransactionEvent,
          key: 'rentalTransactionId',
        },
      },
      chargeType: DataTypes.STRING,
      currencyCode: DataTypes.STRING,
      currencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('currencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'itemCharges',
      modelName: 'ItemCharge',
    }
  );
  return ItemCharge;
};
