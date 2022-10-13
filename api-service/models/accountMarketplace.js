'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccountMarketplace extends Model {
    static associate({ Account, Marketplace }) {
      this.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
      this.belongsTo(Marketplace, {
        foreignKey: 'marketplaceId',
        as: 'details',
      });
    }
  }
  AccountMarketplace.init(
    {
      accountId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      marketplaceId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'AccountMarketplace',
      tableName: 'accountMarketplaces',
      timestamps: false,
    }
  );
  return AccountMarketplace;
};
