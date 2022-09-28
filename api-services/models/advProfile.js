'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdvProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Account,
      Marketplace,
      AdvPortfolio,
      AdvCampaign,
      AdvReport,
    }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        as: 'account',
      });
      this.belongsTo(Marketplace, {
        foreignKey: 'marketplaceId',
        as: 'marketplace',
      });
      this.hasMany(AdvPortfolio, { foreignKey: 'advProfileId' });
      this.hasMany(AdvCampaign, { foreignKey: 'advProfileId' });
      this.hasMany(AdvReport, { foreignKey: 'advProfileId' });
    }
  }
  AdvProfile.init(
    {
      advProfileId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        foreignKey: true,
      },
      marketplaceId: {
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true,
      },
      dailyBudget: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sandbox: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'advProfiles',
      modelName: 'AdvProfile',
    }
  );

  AdvProfile.prototype.apiClient = async function (options = {}) {
    try {
      const account = await this.getAccount();

      const advApiClient = await account.advApiClient({
        sandbox: this.sandbox,
        maxRetry: 5,
        region: 'na',
        profileId: this.advProfileId,
        ...options,
      });

      return advApiClient;
    } catch (error) {
      console.log(error);
    }
  };

  return AdvProfile;
};
