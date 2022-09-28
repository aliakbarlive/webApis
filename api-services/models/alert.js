'use strict';
const { Model, Op } = require('sequelize');
const { lowerFirst } = require('lodash');

module.exports = (sequelize, DataTypes) => {
  class Alert extends Model {
    static associate({ User, Account, Marketplace, Listing }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
      });

      this.belongsTo(Account, {
        foreignKey: 'accountId',
      });

      this.belongsTo(Marketplace, {
        foreignKey: 'marketplaceId',
      });

      this.belongsTo(Listing, {
        foreignKey: 'listingId',
        as: 'listing',
      });
    }
  }
  Alert.init(
    {
      alertId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      accountId: {
        type: DataTypes.UUID,
      },
      marketplaceId: {
        type: DataTypes.STRING,
      },
      listingId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'listings',
          key: 'listingId',
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: DataTypes.JSONB,
      resolvedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Alert',
      tableName: 'alerts',
      scopes: {
        resolved: {
          where: {
            resolvedAt: {
              [Op.not]: null,
            },
          },
        },
        unresolved: {
          where: {
            resolvedAt: {
              [Op.is]: null,
            },
          },
        },
      },
    }
  );

  return Alert;
};
