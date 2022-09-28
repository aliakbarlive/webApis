'use strict';
const { Model } = require('sequelize');
const User = require('./user');
const Upsell = require('./upsell');

module.exports = (sequelize, DataTypes) => {
  class UpsellOrder extends Model {
    static associate({ Upsell, User }) {
      this.belongsTo(Upsell, { foreignKey: 'upsellId', as: 'upsell' });
      this.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedToUser' });
    }
  }
  UpsellOrder.init(
    {
      upsellOrderId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      upsellId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Upsell,
          key: 'upsellId',
        },
      },
      assignedTo: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      eta: DataTypes.DATE,
      startedAt: DataTypes.DATE,
      completedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'upsellOrders',
      modelName: 'UpsellOrder',
    }
  );
  return UpsellOrder;
};
