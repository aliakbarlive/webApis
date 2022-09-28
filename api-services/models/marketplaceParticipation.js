'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MarketplaceParticipation extends Model {
    static associate() {}
  }
  MarketplaceParticipation.init(
    {
      marketplaceParticipationId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      marketplaceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        foreignKey: true,
      },
      countryCode: DataTypes.STRING,
      name: DataTypes.STRING,
      defaultCurrencyCode: DataTypes.STRING,
      defaultLanguageCode: DataTypes.STRING,
      domainName: DataTypes.STRING,
      isParticipating: DataTypes.BOOLEAN,
      hasSuspendedListings: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: 'marketplaceParticipations',
      modelName: 'MarketplaceParticipation',
      scopes: {
        allowed: {
          where: {
            marketplaceId: ['ATVPDKIKX0DER', 'A2EUQ1WTGCTBG2'],
          },
        },
      },
    }
  );
  return MarketplaceParticipation;
};
