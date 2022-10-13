'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderBuyerInfo extends Model {
    static associate({ Order }) {
      this.belongsTo(Order, { foreignKey: 'amazonOrderId' });
    }
  }
  OrderBuyerInfo.init(
    {
      amazonOrderId: {
        type: DataTypes.STRING,
        primaryKey: true,
        foreignKey: true,
      },
      buyerEmail: DataTypes.STRING,
      buyerName: DataTypes.STRING,
      buyerCounty: DataTypes.STRING,
      buyerTaxInfo: DataTypes.JSONB,
      purchaseOrderNumber: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'orderBuyerInfos',
      modelName: 'OrderBuyerInfo',
    }
  );
  return OrderBuyerInfo;
};
