'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate({ Listing, Note, TagRecord }) {
      this.belongsTo(Listing, {
        foreignKey: 'listingId',
      });
      this.hasMany(Note, {
        foreignKey: 'reviewId',
        constraints: false,
      });
      this.hasMany(TagRecord, {
        foreignKey: 'reviewId',
        constraints: false,
      });
    }
  }
  Review.init(
    {
      reviewId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      listingId: {
        type: DataTypes.BIGINT,
        foreignKey: true,
        allowNull: false,
      },
      asin: {
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true,
      },
      marketplaceId: {
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true,
      },
      title: DataTypes.TEXT,
      body: DataTypes.TEXT,
      link: DataTypes.TEXT,
      rating: DataTypes.DECIMAL,
      reviewDate: DataTypes.DATE,
      profileName: DataTypes.STRING,
      profileLink: DataTypes.STRING,
      profileId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Review',
      tableName: 'reviews',
    }
  );

  Review.afterUpsert(async (created, options) => {
    try {
      const { listingId, reviewId } = options.instance.dataValues;
      const listing = await options.instance.getListing({
        include: [
          {
            model: sequelize.models.Product,
            as: 'product',
            include: {
              model: sequelize.models.Account,
            },
          },
          {
            model: sequelize.models.ListingAlertConfiguration,
            as: 'alertConfiguration',
          },
        ],
      });

      const { marketplaceId, asin } = listing;

      if (
        listing.alertConfiguration &&
        listing.alertConfiguration.status &&
        listing.alertConfiguration.reviews
      ) {
        await listing.product.Account.sendAlertToUsers({
          listingId,
          marketplaceId: marketplaceId,
          type: 'newReview',
          title: `You’ve received new review for your listing ${asin}`,
          data: {
            alertable: {
              type: 'Review',
              where: { listingId, reviewId },
            },
          },
        });
      }
    } catch (error) {
      console.log('Error on Product Review after create hook:', error.message);
    }
  });

  return Review;
};
