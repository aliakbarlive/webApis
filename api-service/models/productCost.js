'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCost extends Model {
    static associate({ InventoryItem }) {
      this.belongsTo(InventoryItem, {
        foreignKey: 'inventoryItemId',
        constraints: false,
      });
    }
  }
  ProductCost.init(
    {
      productCostId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      inventoryItemId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        // references: {
        //   model: 'inventoryItems',
        //   key: 'inventoryItemId'
        // }
      },
      cogsAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      shippingAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      miscAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      startDate: { type: DataTypes.DATE},
      endDate: { type: DataTypes.DATE },
    },
    {
      sequelize,
      tableName: 'productCosts',
      modelName: 'ProductCost',
    }
  );
  return ProductCost;
};
