'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InventoryDetail extends Model {
    static associate({ InventoryItem }) {
      this.belongsTo(InventoryItem, { foreignKey: 'inventoryItemId' });
    }
  }
  InventoryDetail.init(
    {
      inventoryDetailId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        get() {
          return parseInt(this.getDataValue('inventoryDetailId'));
        },
      },
      inventoryItemId: {
        type: DataTypes.BIGINT,
        foreignKey: true,
        get() {
          return parseInt(this.getDataValue('inventoryItemId'));
        },
      },
      fulfillableQuantity: {
        type: DataTypes.BIGINT,
        get() {
          return parseInt(this.getDataValue('fulfillableQuantity'));
        },
      },
      inboundWorkingQuantity: {
        type: DataTypes.BIGINT,
        get() {
          return parseInt(this.getDataValue('inboundWorkingQuantity'));
        },
      },
      inboundShippedQuantity: {
        type: DataTypes.BIGINT,
        get() {
          return parseInt(this.getDataValue('inboundShippedQuantity'));
        },
      },
      inboundReceivingQuantity: {
        type: DataTypes.BIGINT,
        get() {
          return parseInt(this.getDataValue('inboundReceivingQuantity'));
        },
      },
      reservedQuantity: {
        type: DataTypes.JSONB,
      },
      researchingQuantity: {
        type: DataTypes.JSONB,
      },
      unfulfillableQuantity: {
        type: DataTypes.JSONB,
      },
      futureSupplyQuantity: {
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      modelName: 'InventoryDetail',
      tableName: 'inventoryDetails',
    }
  );

  return InventoryDetail;
};
