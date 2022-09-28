'use strict';
const { Model, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvMetric extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvReportEntity, AdvReportEntityMetric }) {
      this.belongsToMany(AdvReportEntity, {
        through: AdvReportEntityMetric,
        foreignKey: 'advMetricId',
      });
    }

    static salesAttribute(campaignType) {
      return campaignType == 'sponsoredBrands'
        ? 'attributedSales14d'
        : 'attributedSales30d';
    }

    static conversionsAttribute(campaignType) {
      return campaignType == 'sponsoredBrands'
        ? 'attributedConversions14d'
        : 'attributedConversions30d';
    }

    static ordersAttribute(campaignType) {
      return campaignType == 'sponsoredBrands'
        ? 'unitsSold14d'
        : 'attributedConversions30d';
    }
  }
  AdvMetric.init(
    {
      advMetricId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      query: {
        type: DataTypes.TEXT,
        defaultValue: `case when SUM(records."{attr}") IS NULL THEN 0 else SUM(records."{attr}") end`,
        get() {
          const attr = this.getDataValue('name');
          return this.getDataValue('query').split('{attr}').join(attr);
        },
      },
      baseQuery: {
        type: DataTypes.VIRTUAL,
        get() {
          const attr = this.getDataValue('name');
          return this.getDataValue('query')
            .split('{attr}')
            .join(attr)
            .split('records.')
            .join('');
        },
      },
      cast: {
        type: DataTypes.ENUM('int', 'float'),
        allowNull: false,
        defaultValue: 'int',
      },
      dependencies: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
    },
    {
      sequelize,
      modelName: 'AdvMetric',
      tableName: 'advMetrics',
      timestamps: false,
      scopes: {
        mainStatistics: {
          where: {
            name: {
              [Op.in]: [
                'profit',
                'orders',
                'sales',
                'acos',
                'clicks',
                'attributedSales14d',
                'attributedSales30d',
                'cost',
                'cpc',
                'cr',
                'ctr',
              ],
            },
          },
        },
      },
    }
  );

  AdvMetric.prototype.toQuery = function (type, cast = true, col = 'query') {
    let query = this[col]
      .split('{salesAttribute}')
      .join(AdvMetric.salesAttribute(type))
      .split('{conversionsAttribute}')
      .join(AdvMetric.conversionsAttribute(type))
      .split('{ordersAttribute}')
      .join(AdvMetric.ordersAttribute(type));

    let queryFn = sequelize.literal(query);

    if (cast) {
      queryFn = [sequelize.cast(queryFn, this.cast), this.name];
    }

    return queryFn;
  };

  return AdvMetric;
};
