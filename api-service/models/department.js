'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate({ Squad, UserGroup }) {
      this.hasMany(Squad, {
        foreignKey: 'departmentId',
      });
      this.hasMany(UserGroup, {
        foreignKey: 'departmentId',
      });
    }
  }

  Department.init(
    {
      departmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'department',
      modelName: 'Department',
    }
  );
  return Department;
};
