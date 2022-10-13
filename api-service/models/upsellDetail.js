'use strict';
const { Model } = require('sequelize');
const UpsellItem = require('./upsellItem');
const Upsell = require('./upsell');

module.exports = (sequelize, DataTypes) => {
  class UpsellDetail extends Model {
    static associate({ Upsell }) {
      this.belongsTo(Upsell, { foreignKey: 'upsellId' });
    }
  }
  UpsellDetail.init(
    {
      upsellDetailId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      upsellId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Upsell,
          key: 'upsellId',
        },
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.FLOAT,
      qty: DataTypes.INTEGER,
      code: DataTypes.STRING,
      type: DataTypes.STRING,
      addonId: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'upsellDetails',
      modelName: 'UpsellDetail',
    }
  );
  return UpsellDetail;
};
