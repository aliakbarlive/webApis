'use strict';
const { Model } = require('sequelize');
const AdvProfile = require('./advProfile');
const User = require('./user');
const AdvOptimizationBatch = require('./advOptimizationBatch');

module.exports = (sequelize, DataTypes) => {
  class AdvChangeCollection extends Model {
    static associate({ User, AdvChange }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
      });
      this.hasMany(AdvChange, {
        foreignKey: 'advChangeCollectionId',
        as: 'changes',
      });
    }
  }
  AdvChangeCollection.init(
    {
      advChangeCollectionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      advProfileId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: AdvProfile,
          key: 'advProfileId',
        },
      },
      campaignType: {
        type: DataTypes.ENUM(
          'sponsoredProducts',
          'sponsoredBrands',
          'sponsoredDisplay'
        ),
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      activityDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      advOptimizationBatchId: {
        type: DataTypes.INTEGER,
        references: {
          model: AdvOptimizationBatch,
          key: 'advOptimizationBatchId',
        },
      },
    },
    {
      sequelize,
      tableName: 'advChangeCollections',
      modelName: 'AdvChangeCollection',
      timestamps: false,
    }
  );
  return AdvChangeCollection;
};
