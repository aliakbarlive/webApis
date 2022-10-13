'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pod extends Model {
    static associate({ Cell, UserGroup, User, Squad }) {
      this.hasMany(Cell, {
        foreignKey: 'podId',
      });
      this.hasMany(UserGroup, {
        foreignKey: 'podId',
      });
      this.belongsToMany(User, {
        through: UserGroup,
        as: 'users',
        foreignKey: 'podId',
      });
      this.belongsTo(Squad, {
        as: 'squad',
        foreignKey: 'squadId',
      });
    }
  }

  Pod.init(
    {
      podId: {
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
      squadId: {
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
      tableName: 'pods',
      modelName: 'Pod',
    }
  );
  return Pod;
};
