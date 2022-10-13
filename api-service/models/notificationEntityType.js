'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NotificationEntityType extends Model {
    static associate(models) {}
  }
  NotificationEntityType.init(
    {
      entityTypeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      entity: { type: DataTypes.STRING, allowNull: false },
      i18nAttribute: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'NotificationEntityType',
      tableName: 'notificationEntityTypes',
    }
  );
  return NotificationEntityType;
};
