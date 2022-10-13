'use strict';
const moment = require('moment');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpRequest extends Model {
    static status = ['PENDING', 'PROCESSING', 'PROCESSED', 'FAILED'];

    static associate({ SyncRecord }) {
      this.belongsTo(SyncRecord, {
        foreignKey: 'syncRecordId',
        as: 'syncRecord',
      });
    }
  }
  SpRequest.init(
    {
      spRequestId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      syncRecordId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
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
      message: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: 'spRequests',
      modelName: 'SpRequest',
    }
  );

  SpRequest.prototype.markAsProcessing = async function (message) {
    try {
      const syncRecord = await this.getSyncRecord();

      await this.update({ status: 'PROCESSING', message });
      await syncRecord.markAs('PROCESSING');
    } catch (error) {
      console.log(error);
    }
  };

  SpRequest.prototype.markAsCompleted = async function () {
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

  SpRequest.prototype.markAsFailed = async function (msg, attempts, onQueue) {
    try {
      await this.update({
        status: 'FAILED',
        message: msg,
        attempts,
        onQueue,
      });

      const syncRecord = await this.getSyncRecord();
      const syncRecordReportsCount = await syncRecord.countSpRequests({
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

  SpRequest.prototype.retry = async function () {
    try {
      const { dataType } = await this.getSyncRecord();

      const queue = require(`../queues/${dataType}/save`);

      let job = await queue.getJob(this.jobId);

      if (!job) {
        const data = {
          spRequestId: this.spRequestId,
        };

        job = await queue.add(data, { attempts: 3, backoff: 1000 * 60 * 1 });

        this.jobId = job.id;
      } else {
        await job.retry();
      }

      this.onQueue = true;
      await this.save();
    } catch (error) {
      console.log(error);
    }
  };

  return SpRequest;
};
