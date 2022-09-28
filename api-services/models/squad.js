'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Squad extends Model {
    static associate({ Pod, UserGroup, User }) {
      this.hasMany(Pod, {
        foreignKey: 'squadId',
      });
      this.hasMany(UserGroup, {
        foreignKey: 'squadId',
      });
      this.belongsToMany(User, {
        through: UserGroup,
        as: 'users',
        foreignKey: 'squadId',
      });
    }
  }

  Squad.init(
    {
      squadId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPpc: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'squads',
      modelName: 'Squad',
    }
  );
  return Squad;
};
