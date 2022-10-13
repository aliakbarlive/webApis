'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate({ Listing, RatingRecord }) {
      this.hasMany(RatingRecord, { foreignKey: 'listingId', as: 'records' });
      this.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });
    }
  }
  Rating.init(
    {
      listingId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      overallRating: DataTypes.DECIMAL,
      breakdown: DataTypes.JSONB,
      ratingsTotal: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Rating',
      tableName: 'ratings',
    }
  );
  return Rating;
};
