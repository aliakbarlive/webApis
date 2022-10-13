'use strict';
const { Model } = require('sequelize');

const SAFETReimbursementEvent = require('./safetReimbursementEvent');

module.exports = (sequelize, DataTypes) => {
  class SAFETReimbursementItem extends Model {
    static associate({ SAFETReimbursementEvent, ItemCharge }) {
      this.belongsTo(SAFETReimbursementEvent, {
        foreignKey: 'safetReimbursementEventId',
        constraints: false,
      });
      this.hasMany(ItemCharge, {
        foreignKey: 'safetReimbursementItemId',
        constraints: false,
      });
    }
  }
  SAFETReimbursementItem.init(
    {
      safetReimbursementItemId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      safetReimbursementEventId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: SAFETReimbursementEvent,
          key: 'safetReimbursementEventId',
        },
      },
      productDescription: DataTypes.TEXT,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'safetReimbursementItems',
      modelName: 'SAFETReimbursementItem',
    }
  );
  return SAFETReimbursementItem;
};
