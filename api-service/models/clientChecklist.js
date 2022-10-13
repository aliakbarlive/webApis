'use strict';

const { Model } = require('sequelize');

const Checklist = require('./checklist');
const AgencyClient = require('./agencyClient');

module.exports = (sequelize, DataTypes) => {
  class ClientChecklist extends Model {
    static associate({ AgencyClient, Checklist, Log }) {
      this.hasMany(Log, {
        foreignKey: 'referenceId',
        scope: {
          logType: 'clientChecklist',
        },
      });
      this.belongsTo(Checklist, {
        foreignKey: 'checklistId',
        as: 'checklist',
      });
      this.belongsTo(AgencyClient, {
        foreignKey: 'agencyClientId',
        as: 'agencyClient',
      });
    }
  }
  ClientChecklist.init(
    {
      clientChecklistId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      checklistId: {
        type: DataTypes.INTEGER,
        references: {
          model: Checklist,
          key: 'checklistId',
        },
      },
      agencyClientId: {
        type: DataTypes.UUID,
        references: {
          model: AgencyClient,
          key: 'agencyClientId',
        },
      },
      status: DataTypes.ENUM('incomplete', 'in-progress', 'complete'),
      toggle: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      value: DataTypes.JSONB,
      transactionDate: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'clientChecklists',
      modelName: 'ClientChecklist',
    }
  );

  return ClientChecklist;
};
