'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderAddress extends Model {
    static associate({ Order, OrderItem }) {
      this.belongsTo(Order, { foreignKey: 'amazonOrderId' });
      this.hasMany(OrderItem, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
    }
  }
  OrderAddress.init(
    {
      amazonOrderId: {
        type: DataTypes.STRING,
        primaryKey: true,
        foreignKey: true,
      },
      city: DataTypes.STRING,
      stateOrRegion: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      countryCode: DataTypes.STRING,
      name: DataTypes.STRING,
      addressLine1: DataTypes.STRING,
      addressLine2: DataTypes.STRING,
      addressLine3: DataTypes.STRING,
      county: DataTypes.STRING,
      district: DataTypes.STRING,
      municipality: DataTypes.STRING,
      phone: DataTypes.STRING,
      addressType: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'orderAddresses',
      modelName: 'OrderAddress',
    }
  );
  return OrderAddress;
};
