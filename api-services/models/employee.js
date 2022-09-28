'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate({ User, Role }) {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsTo(Role, { foreignKey: 'roleId' });
    }
  }
  Employee.init(
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: 'employees',
      modelName: 'Employee',
    }
  );

  return Employee;
};
