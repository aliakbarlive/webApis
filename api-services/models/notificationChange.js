'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NotificationChange extends Model {
    static associate({ NotificationObject, User }) {
      this.belongsTo(NotificationObject, {
        foreignKey: 'notificationObjectId',
        as: 'notificationObject',
      });
      this.belongsTo(User, {
        foreignKey: 'creatorId',
        sourceKey: 'userId',
        as: 'creator',
      });
    }
  }
  NotificationChange.init(
    {
      notificationChangeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      notificationObjectId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'NotificationChange',
      tableName: 'notificationChanges',
    }
  );
  return NotificationChange;
};
