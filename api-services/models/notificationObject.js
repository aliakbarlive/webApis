'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NotificationObject extends Model {
    static associate({
      NotificationEntityType,
      NotificationChange,
      Notification,
    }) {
      this.belongsTo(NotificationEntityType, {
        foreignKey: 'entityTypeId',
        as: 'entityType',
      });
      this.belongsTo(NotificationChange, {
        foreignKey: 'notificationObjectId',
        as: 'notificationChange',
      });
      this.belongsTo(Notification, {
        foreignKey: 'notificationObjectId',
        as: 'notification',
      });
    }
  }
  NotificationObject.init(
    {
      notificationObjectId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      entityTypeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      entityId: { type: DataTypes.STRING, allowNull: false },
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'NotificationObject',
      tableName: 'notificationObjects',
    }
  );
  return NotificationObject;
};
