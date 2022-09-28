'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TagRecord extends Model {
    static associate({ Product, InventoryItem, Order, Review, Tag }) {
      this.belongsTo(Product, { foreignKey: 'asin', constraints: false });
      this.belongsTo(InventoryItem, {
        foreignKey: 'inventoryItemId',
        constraints: false,
      });
      this.belongsTo(Order, {
        foreignKey: 'amazonOrderId',
        constraints: false,
      });
      this.belongsTo(Review, { foreignKey: 'reviewId', constraints: false });
      this.belongsTo(Tag, {
        foreignKey: 'tagId',
        onDelete: 'cascade',
        constraints: false,
      });
    }
  }
  TagRecord.init(
    {
      tagRecordId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      amazonOrderId: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      reviewId: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      asin: {
        type: DataTypes.STRING,
        foreignKey: true,
      },
      inventoryItemId: {
        type: DataTypes.BIGINT,
        foreignKey: true,
      },
      tagId: {
        type: DataTypes.BIGINT,
        foreignKey: true,
      },
    },
    {
      sequelize,
      tableName: 'tagRecords',
      modelName: 'TagRecord',
    }
  );
  return TagRecord;
};
