'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate({ Order, Product }) {
      this.belongsTo(Order, { foreignKey: 'amazonOrderId' });
      this.belongsTo(Product, { foreignKey: 'asin', constraints: false });
    }
  }
  OrderItem.init(
    {
      orderItemId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      amazonOrderItemId: {
        type: DataTypes.STRING,
      },
      amazonOrderId: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      asin: DataTypes.STRING,
      title: DataTypes.TEXT,
      sellerSku: DataTypes.STRING,
      itemStatus: DataTypes.STRING,
      quantityOrdered: DataTypes.INTEGER,
      quantityShipped: DataTypes.INTEGER,
      numberOfItems: DataTypes.INTEGER,
      itemPriceCurrencyCode: DataTypes.STRING,
      itemPriceAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('itemPriceAmount'));
        },
      },
      itemTaxCurrencyCode: DataTypes.STRING,
      itemTaxAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('itemTaxAmount'));
        },
      },
      taxCollectionCollectionModel: DataTypes.STRING,
      taxCollectionReponsibleParty: DataTypes.STRING,
      promotionDiscountTaxCurrencyCode: DataTypes.STRING,
      promotionDiscountTaxAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('promotionDiscountTaxAmount'));
        },
      },
      promotionDiscountCurrencyCode: DataTypes.STRING,
      promotionDiscountAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('promotionDiscountAmount'));
        },
      },
      serialNumberRequired: DataTypes.BOOLEAN,
      isGift: DataTypes.BOOLEAN,
      isTransparency: DataTypes.BOOLEAN,
      pointsGranted: DataTypes.JSONB,
      shippingPriceCurrencyCode: DataTypes.STRING,
      shippingPriceAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('shippingPriceAmount'));
        },
      },
      shippingTaxCurrencyCode: DataTypes.STRING,
      shippingTaxAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('shippingTaxAmount'));
        },
      },
      shippingDiscountCurrencyCode: DataTypes.STRING,
      shippingDiscountAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('shippingDiscountAmount'));
        },
      },
      shippingDiscountTaxCurrencyCode: DataTypes.STRING,
      shippingDiscountTaxAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('shippingDiscountTaxAmount'));
        },
      },
      promotionIds: DataTypes.JSONB,
      codFeeCurrencyCode: DataTypes.STRING,
      codFeeAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('codFeeAmount'));
        },
      },
      codFeeDiscountCurrencyCode: DataTypes.STRING,
      codFeeDiscountAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('codFeeDiscountAmount'));
        },
      },
      conditionNote: DataTypes.STRING,
      conditionId: DataTypes.STRING,
      conditionSubtypeId: DataTypes.STRING,
      scheduledDeliveryStartDate: DataTypes.DATE,
      scheduledDeliveryEndDate: DataTypes.DATE,
      priceDesignation: DataTypes.STRING,
      iossNumber: DataTypes.STRING,
      storeChainStoreId: DataTypes.STRING,
      deemedResellerCategory: DataTypes.JSONB,
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['amazonOrderId'],
        },
        {
          unique: false,
          fields: ['asin'],
        },
      ],
      sequelize,
      tableName: 'orderItems',
      modelName: 'OrderItem',
    }
  );
  return OrderItem;
};
