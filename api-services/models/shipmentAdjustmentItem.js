'use strict';
const { Model } = require('sequelize');

const RefundEvent = require('./refundEvent');
const ChargebackEvent = require('./chargebackEvents');
const GuaranteeClaimEvent = require('./guaranteeClaimEvents');

module.exports = (sequelize, DataTypes) => {
  class ShipmentAdjustmentItem extends Model {
    static associate({
      RefundEvent,
      ChargebackEvent,
      GuaranteeClaimEvent,
      ItemChargeAdjustment,
      ItemFeeAdjustment,
      ItemTaxWithheldAdjustment,
      ItemPromotionAdjustment,
    }) {
      this.belongsTo(RefundEvent, {
        foreignKey: 'refundEventId',
        constraints: false,
      });
      this.belongsTo(ChargebackEvent, {
        foreignKey: 'chargebackEventId',
        constraints: false,
      });
      this.belongsTo(GuaranteeClaimEvent, {
        foreignKey: 'guaranteeEventId',
        constraints: false,
      });
      this.hasMany(ItemChargeAdjustment, {
        foreignKey: 'shipmentAdjustmentItemId',
        sourceKey: 'shipmentAdjustmentItemId',
        constraints: false,
      });
      this.hasMany(ItemFeeAdjustment, {
        foreignKey: 'shipmentAdjustmentItemId',
        sourceKey: 'shipmentAdjustmentItemId',
        constraints: false,
      });
      this.hasMany(ItemTaxWithheldAdjustment, {
        foreignKey: 'shipmentAdjustmentItemId',
        constraints: false,
      });
      this.hasMany(ItemPromotionAdjustment, {
        foreignKey: 'shipmentAdjustmentItemId',
        constraints: false,
      });
    }
  }
  ShipmentAdjustmentItem.init(
    {
      shipmentAdjustmentItemId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      refundEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: RefundEvent,
          key: 'refundEventId',
        },
      },
      chargebackEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: ChargebackEvent,
          key: 'chargebackEventId',
        },
      },
      guaranteeEventId: {
        type: DataTypes.BIGINT,
        references: {
          model: GuaranteeClaimEvent,
          key: 'guaranteeEventId',
        },
      },
      orderAdjustmentItemId: DataTypes.STRING,
      amazonOrderId: DataTypes.STRING,
      sellerSku: DataTypes.STRING,
      quantityShipped: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['amazonOrderId'],
        },
      ],
      sequelize,
      tableName: 'shipmentAdjustmentItems',
      modelName: 'ShipmentAdjustmentItem',
    }
  );
  return ShipmentAdjustmentItem;
};
