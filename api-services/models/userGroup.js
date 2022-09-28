'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserGroup extends Model {
    static associate({ User, Squad, Pod, Cell }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
      });
      this.belongsTo(Squad, {
        foreignKey: 'squadId',
        as: 'squad',
      });
      this.belongsTo(Pod, {
        foreignKey: 'podId',
        as: 'pod',
      });
      this.belongsTo(Cell, {
        foreignKey: 'cellId',
        as: 'cell',
      });
    }
  }

  UserGroup.init(
    {
      userId: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      squadId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      podId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      cellId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      podId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
    },
    {
      sequelize,
      tableName: 'userGroup',
      modelName: 'UserGroup',
    }
  );
  return UserGroup;
};
