'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    static associate({ Account, Feature, PlanFeature }) {
      this.hasMany(Account, {
        foreignKey: 'planId',
        as: 'accounts',
      });

      this.belongsToMany(Feature, {
        through: PlanFeature,
        as: 'features',
        foreignKey: 'planId',
      });
    }
  }
  Plan.init(
    {
      planId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'plans',
      modelName: 'Plan',
    }
  );

  return Plan;
};
