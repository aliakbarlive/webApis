'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate({ InventoryItem, Product, Order, Review }) {
      this.belongsTo(InventoryItem, {
        foreignKey: 'inventoryItemId',
        constraints: false,
      });
      this.belongsTo(Product, { foreignKey: 'asin', constraints: false });
      this.belongsTo(Order, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.belongsTo(Review, { foreignKey: 'reviewId', constraints: false });
    }
  }
  Note.init(
    {
      noteId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      accountId: {
        type: DataTypes.UUID,
        foreignKey: true,
      },
      reviewId: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      inventoryItemId: {
        type: DataTypes.BIGINT,
        foreignKey: true,
      },
      asin: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      amazonOrderId: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      body: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Note',
      tableName: 'notes',
    }
  );
  return Note;
};
