'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static SYSTEM_LEVEL = 'system';
    static AGENCY_LEVEL = 'agency';
    static APPLICATION_LEVEL = 'application';
    static ACCOUNT_LEVEL = 'account';

    static SUPER_USER = 'super user';
    static ADMINISTRATOR = 'administrator';
    static SALES_ADMINISTRATOR = 'sales administrator';
    static OWNER = 'owner';
    static USER = 'user';

    static associate({ Employee, Member, Permission, RolePermission, User }) {
      this.hasMany(Employee, {
        foreignKey: 'roleId',
        as: 'employees',
      });

      this.hasMany(User, {
        foreignKey: 'roleId',
        as: 'users',
      });

      this.hasMany(Member, { foreignKey: 'roleId', as: 'members' });

      this.belongsToMany(Permission, {
        through: RolePermission,
        as: 'permissions',
        foreignKey: 'roleId',
      });
    }
  }
  Role.init(
    {
      roleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.ENUM('application', 'agency', 'account', 'system'),
        allowNull: false,
      },
      groupLevel: {
        type: DataTypes.STRING,
      },
      allowPerGroup: {
        type: DataTypes.INTEGER,
      },
      hasAccessToAllClients: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      department: {
        type: DataTypes.STRING,
        defaultValue: 'operations',
      },
      seniorityLevel: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
    }
  );

  // check rolename
  Role.prototype.is = function (name) {
    return this.name === name;
  };

  return Role;
};
