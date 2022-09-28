'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryRanking extends Model {
    static associate({ Listing, CategoryRankingRecord }) {
      this.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });
      this.hasMany(CategoryRankingRecord, {
        foreignKey: 'categoryRankingId',
        as: 'records',
      });
    }
  }
  CategoryRanking.init(
    {
      categoryRankingId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      listingId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        foreignKey: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rank: DataTypes.INTEGER,
      link: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'CategoryRanking',
      tableName: 'categoryRankings',
    }
  );
  return CategoryRanking;
};
