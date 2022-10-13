'use strict';
const { Model } = require('sequelize');
const AdvAdGroup = require('./advAdGroup');

module.exports = (sequelize, DataTypes) => {
  class AdvNegativeKeyword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvAdGroup }) {
      this.belongsTo(AdvAdGroup, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });
    }
  }

  AdvNegativeKeyword.init(
    {
      advNegativeKeywordId: {
        type: DataTypes.BIGINT,
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
      keywordText: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      matchType: DataTypes.ENUM('negativeExact', 'negativePhrase'),
      state: DataTypes.ENUM('enabled', 'paused', 'archived'),
      servingStatus: DataTypes.STRING,
      syncAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      creationDate: DataTypes.BIGINT,
      lastUpdatedDate: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'AdvNegativeKeyword',
      tableName: 'advNegativeKeywords',
      timestamps: false,
    }
  );
  return AdvNegativeKeyword;
};
