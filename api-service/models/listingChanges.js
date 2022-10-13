'use strict';
const { Model } = require('sequelize');
const { camelCase, upperFirst } = require('lodash');

module.exports = (sequelize, DataTypes) => {
  class ListingChanges extends Model {
    static associate({ Listing }) {
      this.belongsTo(Listing, { foreignKey: 'listingId' });
    }
  }
  ListingChanges.init(
    {
      listingChangeId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      listingId: {
        type: DataTypes.BIGINT,
        foreignKey: true,
        allowNull: false,
      },
      dataType: {
        type: DataTypes.STRING,
      },
      data: DataTypes.JSONB,
    },
    {
      sequelize,
      tableName: 'listingChanges',
      modelName: 'ListingChanges',
    }
  );

  ListingChanges.afterCreate(async (listingChange, options) => {
    try {
      const { listingChangeId, dataType } = listingChange;
      const listing = await listingChange.getListing({
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

      if (
        listing.alertConfiguration &&
        listing.alertConfiguration.status &&
        listing.alertConfiguration[dataType]
      ) {
        const { marketplaceId, asin } = listing;
        const type = dataType.replace('listing', '');

        await listing.product.Account.sendAlertToUsers({
          marketplaceId: marketplaceId,
          type: `listing${upperFirst(camelCase(type))}Changed`,
          title: `Your ${type} on listing ${asin} has been changed.`,
          listingId: listingChange.listingId,
          data: {
            alertable: {
              type: 'ListingChanges',
              id: listingChangeId,
            },
          },
        });
      }
    } catch (error) {
      console.log('Error on listing changes after create hook:', error.message);
    }
  });
  return ListingChanges;
};
