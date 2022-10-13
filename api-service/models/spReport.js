'use strict';
const { Model } = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class SpReport extends Model {
    static status = [
      'STARTED',
      'REQUESTING',
      'REQUESTED',
      'PROCESSING',
      'PROCESSED',
      'FAILED',
    ];

    static associate({ SyncRecord }) {
      this.belongsTo(SyncRecord, {
        foreignKey: 'syncRecordId',
        as: 'syncRecord',
      });
    }
  }
  SpReport.init(
    {
      spReportId: {
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
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'STARTED',
      },
      reportId: {
        type: DataTypes.STRING,
      },
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      reportLink: {
        type: DataTypes.STRING,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      completedAt: {
        type: DataTypes.DATE,
      },
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
      processingTime: {
        type: DataTypes.INTEGER,
      },
      message: {
        type: DataTypes.TEXT,
        defaultValue: 'Generation of report pending on queue.',
      },
    },
    {
      sequelize,
      tableName: 'spReports',
      modelName: 'SpReport',
    }
  );

  SpReport.prototype.markAs = async function (status) {
    this.status = status;

    if (status == 'PROCESSED') {
      this.completedAt = moment();
      this.onQueue = false;
    }

    return await this.save();
  };

  SpReport.prototype.markAsProcessing = async function (message = '') {
    try {
      const syncRecord = await this.getSyncRecord();

      await this.update({ status: 'PROCESSING', message });
      await syncRecord.markAs('PROCESSING');
    } catch (error) {
      console.log(error);
    }
  };

  SpReport.prototype.markAsCompleted = async function () {
    try {
      const syncRecord = await this.getSyncRecord();

      await this.update({
        status: 'PROCESSED',
        completedAt: moment(),
        onQueue: false,
        message: 'Successfully saved records.',
      });

      await syncRecord.decrement('pendingReports');

      if (syncRecord.pendingReports === 0) {
        await syncRecord.markAs('COMPLETED');
      }
    } catch (error) {
      console.log(error);
    }
  };

  SpReport.prototype.markAsFailed = async function (msg, attempts, onQueue) {
    try {
      await this.update({
        status: 'FAILED',
        message: msg,
        attempts,
        onQueue,
      });

      const syncRecord = await this.getSyncRecord();
      const syncRecordReportsCount = await syncRecord.countSpReports({
        where: {
          status: 'FAILED',
          onQueue: false,
        },
      });

      if (syncRecord.totalReports == syncRecordReportsCount) {
        await syncRecord.markAs('FAILED');
      }
    } catch (error) {
      console.log(error);
    }
  };

  SpReport.prototype.retry = async function () {
    try {
      const { dataType } = await this.getSyncRecord();

      const queue = this.getQueue(dataType);

      let job = await queue.getJob(this.jobId);

      if (!job) {
        if (dataType == 'orders') {
          await queue.add({ spReportId: this.spReportId });

          this.update({ jobId: job.id, onQueue: true });

          return;
        }

        throw new Error('Job has been cleared to redis');
      }

      await job.retry();

      await this.update({ onQueue: true });
    } catch (error) {
      console.log(error);
    }
  };

  SpReport.prototype.getQueue = function (dataType) {
    let fileDirectory = '';

    switch (dataType) {
      case 'inventory':
      case 'products':
      case 'reviews':
        fileDirectory = `/${dataType}/save`;
        break;
      case 'orders':
        fileDirectory = this.reportId ? '/orders/save' : '/orders/generate';
        break;
    }

    return require(`../queues/${fileDirectory}`);
  };

  return SpReport;
};
