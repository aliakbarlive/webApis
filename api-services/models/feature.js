'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feature extends Model {
    static associate({ Plan, PlanFeature }) {
      this.belongsToMany(Plan, {
        through: PlanFeature,
        as: 'plans',
        foreignKey: 'featureId',
      });
    }
  }
  Feature.init(
    {
      featureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      restrictions: {
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      modelName: 'Feature',
      tableName: 'features',
    }
  );
  return Feature;
};
