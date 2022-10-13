'use strict';
const { Model } = require('sequelize');
const AgencyClient = require('./agencyClient');
const User = require('./user');
module.exports = (sequelize, DataTypes) => {
  class AgencyClientLog extends Model {
    static associate({ User, AgencyClient }) {
      this.belongsTo(User, {
        foreignKey: 'addedBy',
        as: 'addedByUser',
      });
      this.belongsTo(AgencyClient, {
        foreignKey: 'agencyClientId',
        as: 'agencyClient',
      });
    }
  }
  AgencyClientLog.init(
    {
      agencyClientLogId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      agencyClientId: {
        type: DataTypes.UUID,
        references: {
          model: AgencyClient,
          key: 'agencyClientId',
        },
      },
      tags: DataTypes.TEXT,
      message: DataTypes.TEXT,
      addedBy: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
    },
    {
      sequelize,
      modelName: 'AgencyClientLog',
      tableName: 'agencyClientsLogs',
    }
  );
  return AgencyClientLog;
};
