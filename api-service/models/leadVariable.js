'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LeadVariable extends Model {
    static associate() {}
  }
  LeadVariable.init(
    {
      leadVariableId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      key: DataTypes.STRING,
      value: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'leadVariables',
      modelName: 'LeadVariable',
    }
  );
  return LeadVariable;
};
