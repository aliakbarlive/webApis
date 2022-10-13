'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KeywordRankingRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ KeywordRanking, Product }) {
      this.belongsTo(KeywordRanking, {
        foreignKey: 'keywordId',
        constraints: false,
      });
    }
  }
  KeywordRankingRecord.init(
    {
      keywordRankingId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      keywordId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'keywordRankings',
          key: 'keywordId',
        },
      },
      asin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalRecords: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalPages: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rankings: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currentPage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'keywordRankingRecords',
      modelName: 'KeywordRankingRecord',
    }
  );
  return KeywordRankingRecord;
};
