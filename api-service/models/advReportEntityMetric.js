'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvReportEntityMetric extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvReportEntity, AdvMetric }) {
      this.belongsTo(AdvReportEntity, { foreignKey: 'advReportEntityId' });
      this.belongsTo(AdvMetric, { foreignKey: 'advMetricId' });
    }
  }
  AdvReportEntityMetric.init(
    {
      advReportEntityId: DataTypes.INTEGER,
      advMetricId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'AdvReportEntityMetric',
      tableName: 'advReportEntityMetrics',
      timestamps: false,
    }
  );
  return AdvReportEntityMetric;
};
