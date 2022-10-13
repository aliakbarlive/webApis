'use strict';
const { Model } = require('sequelize');
const AdvPortfolio = require('./advPortfolio');
const _ = require('lodash');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class AdvCampaign extends Model {
    static associate({
      AdvProfile,
      AdvPortfolio,
      AdvAdGroup,
      AdvCampaignNegativeKeyword,
      AdvCampaignRecord,
      AdvRule,
      AdvRuleCampaign,
      AdvCampaignBudgetRecommendation,
    }) {
      this.belongsTo(AdvProfile, { foreignKey: 'advProfileId' });

      this.belongsTo(AdvPortfolio, {
        foreignKey: 'advPortfolioId',
        constraints: false,
      });

      this.hasMany(AdvCampaignNegativeKeyword, {
        foreignKey: 'advCampaignId',
        constraints: false,
      });

      this.hasMany(AdvAdGroup, {
        foreignKey: 'advCampaignId',
        constraints: false,
      });

      this.hasMany(AdvCampaignRecord, {
        foreignKey: 'advCampaignId',
        as: 'records',
        constraints: false,
      });

      this.belongsToMany(AdvRule, {
        through: AdvRuleCampaign,
        foreignKey: 'advCampaignId',
        as: 'rules',
      });

      this.hasOne(AdvCampaignBudgetRecommendation, {
        foreignKey: 'advCampaignId',
        as: 'budgetRecommendation',
      });
    }

    static async bulkSync(records, mainSync = true) {
      return new Promise(async (resolve, reject) => {
        try {
          const attrs = Object.keys(this.rawAttributes);
          records = _.uniqBy(records, 'campaignId').map((r) => {
            let obj = Object.assign(r, {
              advProfileId: parseInt(r.advProfileId),
              advPortfolioId: r.portfolioId || null,
              name: r.campaignName ?? r.name,
            });

            Object.keys(obj).forEach((key) => {
              if (!attrs.includes(key)) {
                delete obj[key];
              }
            });

            return obj;
          });

          if (records.length) {
            records = this.bulkCreate(records, {
              updateOnDuplicate: mainSync ? attrs : ['advProfileId'],
            });
          }

          return resolve(records);
        } catch (error) {
          return reject(error);
        }
      });
    }
  }

  AdvCampaign.init(
    {
      advCampaignId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      advProfileId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        foreignKey: true,
      },
      advPortfolioId: {
        type: DataTypes.BIGINT,
        references: {
          model: AdvPortfolio,
          key: 'advPortfolioId',
        },
      },
      name: DataTypes.STRING,
      dailyBudget: DataTypes.DECIMAL,
      campaignType: DataTypes.STRING,
      targetingType: DataTypes.STRING,
      premiumBidAdjustment: DataTypes.BOOLEAN,
      bidding: DataTypes.JSONB,
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
      state: DataTypes.ENUM('enabled', 'paused', 'archived'),
      servingStatus: DataTypes.STRING,
      budget: DataTypes.DECIMAL,
      budgetType: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      syncAt: DataTypes.DATE,
      adFormat: DataTypes.STRING,
      creative: DataTypes.JSONB,
      landingPage: DataTypes.JSONB,
      supplySource: DataTypes.STRING,
      creationDate: DataTypes.BIGINT,
      lastUpdatedDate: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'AdvCampaign',
      tableName: 'advCampaigns',
      timestamps: false,
    }
  );

  AdvCampaign.prototype.requireSync = function () {
    return this.syncAt
      ? moment().isAfter(moment(this.syncAt).add(10, 'minutes'))
      : true;
  };

  AdvCampaign.prototype.getCampaignTypeShortHand = function () {
    switch (this.campaignType) {
      case 'sponsoredProducts':
        return 'sp';
        break;
      case 'sponsoredBrands':
        return 'hsa';
        break;
      case 'sponsoredDisplay':
        return 'sd';
        break;
    }
  };

  AdvCampaign.prototype.sync = async function () {
    try {
      if (this.requireSync()) {
        const advProfile = await this.getAdvProfile();
        const apiClient = await advProfile.apiClient();

        let campaign = await apiClient.getCampaign(
          this.campaignType,
          this.advCampaignId
        );

        campaign.createdAt = campaign.creationDate
          ? new Date(campaign.creationDate)
          : this.createdAt;
        campaign.updatedAt = campaign.lastUpdatedDate
          ? new Date(campaign.lastUpdatedDate)
          : this.updatedAt;

        campaign.syncAt = new Date();

        await this.update(campaign);
      }
    } catch (error) {
      console.log(error);
      console.log(`Failed to sync campaign ${this.advCampaignId}`);
    }
  };

  return AdvCampaign;
};
