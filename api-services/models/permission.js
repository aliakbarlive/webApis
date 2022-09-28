'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate({ Role, RolePermission }) {
      this.belongsToMany(Role, {
        through: RolePermission,
        as: 'permissions',
        foreignKey: 'permissionId',
      });
      this.hasMany(RolePermission, {
        foreignKey: 'permissionId',
      });
    }
  }
  Permission.init(
    {
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      feature: { type: DataTypes.STRING, allowNull: false },
      access: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'Permission',
      tableName: 'permissions',
    }
  );
  return Permission;
};
