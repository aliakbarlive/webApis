'use strict';
const User = require('./user');
const { Model } = require('sequelize');
const NotificationObject = require('./notificationObject');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate({ NotificationObject, User }) {
      this.belongsTo(NotificationObject, {
        foreignKey: 'notificationObjectId',
        as: 'notificationObject',
      });
      this.belongsTo(User, {
        foreignKey: 'recipientId',
        sourceKey: 'userId',
        as: 'recipient',
      });
    }
  }
  Notification.init(
    {
      notificationId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      notificationObjectId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'notifications',
    }
  );
  return Notification;
};
