'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryRankingRecord extends Model {
    static associate({ CategoryRanking }) {
      this.belongsTo(CategoryRanking, { foreignKey: 'categoryRankingId' });
    }
  }
  CategoryRankingRecord.init(
    {
      categoryRankingRecordId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      categoryRankingId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        foreignKey: true,
      },
      rank: DataTypes.INTEGER,
      rankDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'CategoryRankingRecord',
      tableName: 'categoryRankingRecords',
    }
  );
  return CategoryRankingRecord;
};
