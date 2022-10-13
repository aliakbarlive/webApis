'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvReport extends Model {
    static associate({ AgencyClient, AdvProfile, User }) {
      this.belongsTo(AgencyClient, {
        foreignKey: 'clientId',
        as: 'client',
      });

      this.belongsTo(AdvProfile, {
        foreignKey: 'advProfileId',
        as: 'advProfile',
      });

      this.belongsTo(User, {
        foreignKey: 'generatedByUserId',
        as: 'generatedBy',
      });
    }
  }

  AdvReport.init(
    {
      advReportId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      advProfileId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.UUID,
      },
      campaignType: {
        type: DataTypes.STRING,
      },
      generatedByUserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      downloadUrl: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      options: {
        type: DataTypes.JSONB,
      },
      data: {
        type: DataTypes.JSONB,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AdvReport',
      tableName: 'advReports',
    }
  );
  return AdvReport;
};
