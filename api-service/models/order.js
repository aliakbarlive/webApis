'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate({
      Account,
      ShipmentEvent,
      RefundEvent,
      Marketplace,
      OrderItem,
      OrderAddress,
      Note,
      TagRecord,
    }) {
      this.belongsTo(Account, { foreignKey: 'accountId' });
      this.hasMany(ShipmentEvent, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.hasMany(RefundEvent, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.hasMany(OrderItem, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.hasOne(OrderAddress, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.belongsTo(Marketplace, {
        foreignKey: 'marketplaceId',
        constraints: false,
      });
      this.hasMany(Note, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.hasMany(TagRecord, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
    }
  }
  Order.init(
    {
      amazonOrderId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      accountId: {
        type: DataTypes.UUID,
        foreignKey: true,
        allowNull: false,
      },
      marketplaceId: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      purchaseDate: { type: DataTypes.DATE, allowNull: false },
      lastUpdateDate: { type: DataTypes.DATE, allowNull: false },
      orderStatus: { type: DataTypes.STRING, allowNull: false },
      sellerOrderId: { type: DataTypes.STRING, allowNull: false },
      fulfillmentChannel: DataTypes.STRING,
      salesChannel: DataTypes.STRING,
      shipServiceLevel: DataTypes.STRING,
      numberOfItemsShipped: DataTypes.INTEGER,
      orderType: DataTypes.STRING,
      earliestShipDate: DataTypes.DATE,
      latestShipDate: DataTypes.DATE,
      orderTotalCurrencyCode: DataTypes.STRING,
      orderTotalAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('orderTotalAmount'));
        },
      },
      shipPromotionDiscount: DataTypes.FLOAT,
      isBusinessOrder: DataTypes.BOOLEAN,
      numberOfItemsUnshipped: DataTypes.INTEGER,
      paymentMethod: DataTypes.STRING,
      paymentMethodDetails: DataTypes.JSONB,
      shipmentServiceLevelCategory: DataTypes.STRING,
      sellerDisplayName: DataTypes.STRING,
      orderChannel: DataTypes.STRING,
      paymentExecutionDetail: DataTypes.JSONB,
      easyShipShipmentStatus: DataTypes.STRING,
      cbaDisplayableShippingLabel: DataTypes.STRING,
      earliestDeliveryDate: DataTypes.DATE,
      latestDeliveryDate: DataTypes.DATE,
      replacedOrderId: DataTypes.STRING,
      promiseResponseDueDate: DataTypes.DATE,
      defaultShipFromLocationAddress: DataTypes.JSONB,
      fulfillmentInstruction: DataTypes.JSONB,
      marketplaceTaxInfo: DataTypes.JSONB,
      isPremiumOrder: DataTypes.BOOLEAN,
      isPrime: DataTypes.BOOLEAN,
      isReplacementOrder: DataTypes.BOOLEAN,
      isSoldByAB: DataTypes.BOOLEAN,
      isISPU: DataTypes.BOOLEAN,
      isGlobalExpressEnabled: DataTypes.BOOLEAN,
      isEstimatedShipDateSet: DataTypes.BOOLEAN,
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['marketplaceId'],
        },
        {
          unique: false,
          fields: ['purchaseDate'],
        },
      ],
      sequelize,
      tableName: 'orders',
      modelName: 'Order',
    }
  );
  return Order;
};
