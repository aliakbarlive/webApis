'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RatingRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Rating, ProductRating }) {
      this.belongsTo(Rating, { foreignKey: 'listingId' });
    }
  }
  RatingRecord.init(
    {
      RatingRecordId: {
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
      overallRating: DataTypes.DECIMAL,
      breakdown: DataTypes.JSONB,
      ratingsTotal: DataTypes.INTEGER,
      ratingDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'RatingRecord',
      tableName: 'ratingRecords',
    }
  );
  return RatingRecord;
};
