'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Checklist extends Model {
    static associate({ ClientChecklist }) {
      this.hasMany(ClientChecklist, {
        foreignKey: 'checklistId',
        as: 'clientChecklist',
      });
    }
  }
  Checklist.init(
    {
      checklistId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      defaultToggle: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      checklistType: DataTypes.ENUM(
        'none',
        'email',
        'file',
        'form',
        'text',
        'url',
        'radio'
      ),
      defaultValue: {
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      tableName: 'checklists',
      modelName: 'Checklist',
    }
  );

  return Checklist;
};
