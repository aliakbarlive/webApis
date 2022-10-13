'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SyncReport extends Model {
    static associate({ SyncRecord }) {
      this.belongsTo(SyncRecord, {
        foreignKey: 'syncRecordId',
        as: 'syncRecord',
      });
    }
  }
  SyncReport.init(
    {
      syncReportId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      syncRecordId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        foreignKey: true,
      },
      date: DataTypes.DATEONLY,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      status: {
        type: DataTypes.ENUM(
          'STARTED',
          'REQUESTING',
          'REQUESTED',
          'PROCESSING',
          'PROCESSED',
          'FAILED'
        ),
        allowNull: false,
        defaultValue: 'STARTED',
      },
      referenceId: {
        type: DataTypes.STRING,
      },
      meta: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      startedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      completedAt: DataTypes.DATE,
      jobId: {
        type: DataTypes.STRING,
      },
      attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      onQueue: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      processingTime: DataTypes.INTEGER,
      message: {
        type: DataTypes.TEXT,
        defaultValue: 'Report pending on queue.',
      },
    },
    {
      sequelize,
      modelName: 'SyncReport',
      tableName: 'syncReports',
    }
  );
  return SyncReport;
};
