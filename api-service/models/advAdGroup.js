'use strict';
const { Model } = require('sequelize');
const AdvCampaign = require('./advCampaign');
const _ = require('lodash');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class AdvAdGroup extends Model {
    static associate({
      AdvCampaign,
      AdvKeyword,
      AdvNegativeKeyword,
      AdvTarget,
      AdvNegativeTarget,
      AdvProductAd,
      AdvAdGroupRecord,
    }) {
      this.belongsTo(AdvCampaign, {
        foreignKey: 'advCampaignId',
        constraints: false,
      });

      this.hasMany(AdvKeyword, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });

      this.hasMany(AdvNegativeKeyword, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });

      this.hasMany(AdvTarget, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });

      this.hasMany(AdvNegativeTarget, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });

      this.hasMany(AdvProductAd, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });

      this.hasMany(AdvAdGroupRecord, {
        foreignKey: 'advAdGroupId',
        as: 'records',
        constraints: false,
      });
    }

    static async bulkSync(records, mainSync = true) {
      return new Promise(async (resolve, reject) => {
        try {
          const attrs = Object.keys(this.rawAttributes);

          records = _.uniqBy(records, 'adGroupId').map((r) => {
            let obj = Object.assign(r, {
              name: r.adGroupName ?? r.name,
            });

            Object.keys(obj).forEach((key) => {
              if (!attrs.includes(key)) {
                delete obj[key];
              }
            });
            return obj;
          });

          records = await this.bulkCreate(records, {
            updateOnDuplicate: mainSync ? attrs : ['advCampaignId'],
          });

          return resolve(records);
        } catch (error) {
          return reject(error);
        }
      });
    }
  }
  AdvAdGroup.init(
    {
      advAdGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      advCampaignId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: AdvCampaign,
          key: 'advCampaignId',
        },
      },
      name: DataTypes.STRING,
      defaultBid: DataTypes.DECIMAL,
      state: DataTypes.ENUM('enabled', 'paused', 'archived'),
      servingStatus: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      syncAt: DataTypes.DATE,
      creationDate: DataTypes.BIGINT,
      lastUpdatedDate: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'AdvAdGroup',
      tableName: 'advAdGroups',
      timestamps: false,
    }
  );

  AdvAdGroup.prototype.requireSync = function () {
    return this.syncAt
      ? moment().isAfter(moment(this.syncAt).add(10, 'minutes'))
      : true;
  };

  AdvAdGroup.prototype.sync = async function () {
    try {
      if (this.requireSync()) {
        const advCampaign = await this.getAdvCampaign({
          include: {
            model: sequelize.models.AdvProfile,
          },
        });

        const apiClient = await advCampaign.AdvProfile.apiClient();

        let adGroup = await apiClient.getAdGroup(this.advAdGroupId, {
          campaignType: advCampaign.getCampaignTypeShortHand(),
          version: advCampaign.campaignType == 'sponsoredProducts' ? 'v2' : '',
          isExtended: advCampaign.campaignType != 'sponsoredBrands',
        });

        adGroup.createdAt = adGroup.creationDate
          ? new Date(adGroup.creationDate)
          : this.createdAt;
        adGroup.updatedAt = adGroup.lastUpdatedDate
          ? new Date(adGroup.lastUpdatedDate)
          : this.updatedAt;

        adGroup.syncAt = new Date();

        await this.update(adGroup);
      }
    } catch (error) {
      console.log(error);
      console.log(`Failed to sync adGroup ${this.advAdGroupId}`);
    }
  };

  return AdvAdGroup;
};
