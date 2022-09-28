'use strict';
const { Model } = require('sequelize');

const ShipmentItem = require('./shipmentitem');
const ImagingServicesFeeEvent = require('./imagingServicesFeeEvent');
const RentalTransactionEvent = require('./rentalTransactionEvent');
const ServiceFeeEvent = require('./serviceFeeEvent');
const PayWithAmazonEvent = require('./payWithAmazonEvent');

module.exports = (sequelize, DataTypes) => {
  class ItemFee extends Model {
    static associate({
      ShipmentItem,
      ImagingServicesFeeEvent,
      RentalTransactionEvent,
      ServiceFeeEvent,
      PayWithAmazonEvent,
    }) {
      this.belongsTo(ShipmentItem, {
        foreignKey: 'shipmentItemId',
        sourceKey: 'shipmentItemId',
        constraints: false,
        allowNull: false,
      });
      this.belongsTo(ImagingServicesFeeEvent, {
        foreignKey: 'imagingServicesFeeEventId',
        constraints: false,
      });
      this.belongsTo(RentalTransactionEvent, {
        foreignKey: 'rentalTransactionId',
        constraints: false,
      });
      this.belongsTo(ServiceFeeEvent, {
        foreignKey: 'serviceFeeEventId',
        constraints: false,
      });
      this.belongsTo(PayWithAmazonEvent, {
        foreignKey: 'payWithAmazonEventId',
        constraints: false,
      });
    }
  }
  ItemFee.init(
    {
      itemFeeId: {
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
      imagingServicesFeeEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: ImagingServicesFeeEvent,
          key: 'imagingServicesFeeEventId',
        },
      },
      rentalTransactionId: {
        type: DataTypes.BIGINT,
        references: {
          model: RentalTransactionEvent,
          key: 'rentalTransactionId',
        },
      },
      serviceFeeEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: ServiceFeeEvent,
          key: 'serviceFeeEventId',
        },
      },
      payWithAmazonEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: PayWithAmazonEvent,
          key: 'payWithAmazonEventId',
        },
      },
      feeType: DataTypes.STRING,
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
      tableName: 'itemFees',
      modelName: 'ItemFee',
    }
  );
  return ItemFee;
};
