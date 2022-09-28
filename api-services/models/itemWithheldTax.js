'use strict';
const { Model } = require('sequelize');

const ShipmentItem = require('./shipmentitem');
const RentalTransactionEvent = require('./rentalTransactionEvent');

module.exports = (sequelize, DataTypes) => {
  class ItemWithheldTax extends Model {
    static associate({ ShipmentItem, RentalTransactionEvent }) {
      this.belongsTo(ShipmentItem, {
        foreignKey: 'shipmentItemId',
        sourceKey: 'shipmentItemId',
        constraints: false,
      });
      this.belongsTo(RentalTransactionEvent, {
        foreignKey: 'rentalTransactionId',
        constraints: false,
      });
    }
  }
  ItemWithheldTax.init(
    {
      itemTaxWithheldId: {
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
      rentalTransactionId: {
        type: DataTypes.BIGINT,
        references: {
          model: RentalTransactionEvent,
          key: 'rentalTransactionId',
        },
      },
      taxCollectionModel: DataTypes.STRING,
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
      tableName: 'itemWithheldTaxes',
      modelName: 'ItemWithheldTax',
    }
  );
  return ItemWithheldTax;
};
