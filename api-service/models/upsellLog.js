'use strict';
const { Model } = require('sequelize');
const User = require('./user');
const Upsell = require('./upsell');

module.exports = (sequelize, DataTypes) => {
  class UpsellLog extends Model {
    static associate({ User, Upsell }) {
      this.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });
      this.belongsTo(Upsell, { foreignKey: 'upsellId' });
    }
  }
  UpsellLog.init(
    {
      upsellLogId: {
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addedBy: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      isSystemGenerated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'upsellLogs',
      modelName: 'UpsellLog',
    }
  );
  return UpsellLog;
};
