'use strict';
const { Model } = require('sequelize');
const AdvAdGroup = require('./advAdGroup');

module.exports = (sequelize, DataTypes) => {
  class AdvTargeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvAdGroup, AdvTargetingRecord }) {
      this.belongsTo(AdvAdGroup, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });

      this.hasMany(AdvTargetingRecord, {
        foreignKey: 'advTargetingId',
        as: 'records',
        constraints: false,
      });
    }
  }
  AdvTargeting.init(
    {
      advTargetingId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      advAdGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: AdvAdGroup,
          key: 'advAdGroupId',
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      advTargetId: DataTypes.BIGINT,
      advKeywordId: DataTypes.BIGINT,
      matchType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'AdvTargeting',
      tableName: 'advTargetings',
      timestamps: false,
    }
  );
  return AdvTargeting;
};
