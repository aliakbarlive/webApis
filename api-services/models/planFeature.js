'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PlanFeature extends Model {
    static associate() {}
  }
  PlanFeature.init(
    {
      planId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      featureId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'planFeatures',
      modelName: 'PlanFeature',
    }
  );

  return PlanFeature;
};
