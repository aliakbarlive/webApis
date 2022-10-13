'use strict';
const { Model } = require('sequelize');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  class AdvReportEntity extends Model {
    static associate({ AdvMetric, AdvReportEntityMetric }) {
      this.belongsToMany(AdvMetric, {
        through: AdvReportEntityMetric,
        foreignKey: 'advReportEntityId',
        as: 'metrics',
      });
    }
  }

  AdvReportEntity.init(
    {
      advReportEntityId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      campaignType: {
        type: DataTypes.ENUM(
          'sponsoredProducts',
          'sponsoredBrands',
          'sponsoredDisplay'
        ),
        allowNull: false,
      },
      recordType: {
        type: DataTypes.ENUM(
          'campaigns',
          'adGroups',
          'productAds',
          'targets',
          'keywords',
          'negativeKeywords',
          'campaignNegativeKeywords',
          'negativeTargets'
        ),
        allowNull: false,
      },
      segment: DataTypes.STRING,
      tactic: DataTypes.STRING,
      hasSnapshot: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      hasPerformanceReport: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      marketPlace: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      recordTypeInfos: {
        type: DataTypes.VIRTUAL,
        get() {
          if (!this.recordType) return '';

          let infos = 'campaignId,campaignName';

          if (this.recordType != 'campaigns') {
            infos = `${infos},adGroupId,adGroupName`;
          }

          switch (this.recordType) {
            case 'keywords':
              infos = `${infos},keywordId,keywordText,matchType`;
              break;
            case 'productAds':
              infos = `${infos},asin,sku`;
              if (this.campaignType == 'sponsoredDisplay') {
                infos = `${infos},adId`;
              }
              break;
            case 'targets':
              infos = `${infos},targetId,targetingExpression,targetingText,targetingType`;
              break;
          }
          return infos;
        },
      },

      advEntity: {
        type: DataTypes.VIRTUAL,
        get() {
          if (!this.recordType) return '';
          if (this.segment) return 'AdvSearchTerm';
          const entity = _.upperFirst(this.recordType.slice(0, -1));
          return `Adv${entity}`;
        },
      },

      description: {
        type: DataTypes.VIRTUAL,
        get() {
          let desc = `${this.campaignType} ${this.recordType}`;

          if (this.segment) {
            desc = `${desc} segment(${this.segment})`;
          }

          if (this.tactic) {
            desc = `${desc} tactic(${this.tactic})`;
          }
          return desc;
        },
      },

      endpoint: {
        type: DataTypes.VIRTUAL,
        get() {
          if (!this.campaignType) return '';
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
        },
      },
      extended: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.campaignType !== 'sponsoredBrands';
        },
      },
    },
    {
      sequelize,
      modelName: 'AdvReportEntity',
      tableName: 'advReportEntities',
      timestamps: false,
      scopes: {
        snapshot: {
          where: {
            hasSnapshot: true,
          },
        },
        performance: {
          where: {
            hasPerformanceReport: true,
          },
        },
      },
    }
  );

  AdvReportEntity.prototype.getDelay = function (type) {
    if (type == 'snapshot') return 5;
    switch (this.recordType) {
      case 'campaigns':
        return 5;
        break;
      case 'adGroups':
        return 10;
        break;
      default:
        return 15;
        break;
    }
  };

  AdvReportEntity.prototype.getPayload = async function (type, reportDate) {
    if (type == 'snapshot') return {};

    let metrics = await this.getMetrics();
    metrics = metrics.map((metric) => metric.name).join();

    let payload = {
      reportDate,
      metrics: `${metrics},${this.recordTypeInfos}`,
    };

    if (this.segment) {
      payload.segment = this.segment;
    }

    if (this.tactic) {
      payload.tactic = this.tactic;
    }

    if (
      this.campaignType === 'sponsoredBrands' &&
      this.recordType === 'campaigns'
    ) {
      payload.creativeType = 'all';
    }

    return payload;
  };

  return AdvReportEntity;
};
