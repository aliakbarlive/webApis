'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CellClient extends Model {
    static associate({ Cell, AgencyClient }) {
      this.hasMany(Cell, {
        foreignKey: 'cellId',
      });
      this.hasMany(AgencyClient, {
        foreignKey: 'cellId',
      });
    }
  }

  CellClient.init(
    {
      cellId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      agencyClientId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'cellClient',
      modelName: 'CellClient',
    }
  );
  return CellClient;
};
