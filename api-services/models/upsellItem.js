'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UpsellItem extends Model {
    static associate() {}
  }
  UpsellItem.init(
    {
      upsellItemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'upsellItems',
      modelName: 'UpsellItem',
    }
  );
  return UpsellItem;
};
