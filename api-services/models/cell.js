'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cell extends Model {
    static associate({ UserGroup, CellClient, AgencyClient, User, Pod }) {
      this.hasMany(UserGroup, {
        foreignKey: 'cellId',
      });
      this.hasMany(CellClient, {
        foreignKey: 'cellId',
      });
      this.belongsToMany(AgencyClient, {
        through: 'CellClient',
        as: 'clients',
        foreignKey: 'cellId',
      });
      this.belongsToMany(User, {
        through: UserGroup,
        as: 'users',
        foreignKey: 'cellId',
      });
      this.belongsTo(Pod, {
        foreignKey: 'podId',
        as: 'pod',
      });
    }
  }

  Cell.init(
    {
      cellId: {
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
      podId: {
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
      tableName: 'cells',
      modelName: 'Cell',
    }
  );
  return Cell;
};
