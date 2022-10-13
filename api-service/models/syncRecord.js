'use strict';
const { Model } = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class SyncRecord extends Model {
    static DATA_TYPES = [
      { name: 'inventory', syncType: 'daily', cron: '0 23 * * *' },
      { name: 'products', syncType: 'daily', cron: '0 23 * * *' },
      { name: 'reviews', syncType: 'daily', cron: '5 12 * * *' },
      {
        name: 'orders',
        syncType: 'hourly',
        cron: 'minute * * * *',
      },
      {
        name: 'financialEvents',
        syncType: 'hourly',
        cron: 'minute * * * *',
      },
      {
        name: 'inboundFBAShipments',
        syncType: 'daily',
        cron: '0 12 * * *',
      },
      {
        name: 'inboundFBAShipmentItems',
        syncType: 'daily',
        cron: '0 12 * * *',
      },
      {
        name: 'advSnapshots',
        syncType: 'hourly',
        cron: '30 0-3,5-23 * * *',
      },
      {
        name: 'advPerformanceReport',
        syncType: 'daily',
        cron: '0 1 * * *',
      },
    ];

    static associate({ Account, SpReport, SpRequest }) {
      this.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
      this.hasMany(SpReport, { foreignKey: 'syncRecordId' });
      this.hasMany(SpRequest, { foreignKey: 'syncRecordId' });
    }
  }
  SyncRecord.init(
    {
      syncRecordId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      syncType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dataType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      syncDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      pendingReports: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalReports: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      completedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'syncRecords',
      modelName: 'SyncRecord',
    }
  );

  SyncRecord.afterCreate(async (syncRecord, options) => {
    if (syncRecord.syncType === 'initial') {
      const initialSync = await sequelize.models.InitialSyncStatus.findOne({
        where: {
          accountId: syncRecord.accountId,
        },
      });

      if (initialSync) {
        initialSync[syncRecord.dataType] = 'IN-PROGRESS';
        await initialSync.save();
      }
    }
  });

  SyncRecord.prototype.markAs = async function (status) {
    this.status = status;

    if (status === 'FAILED' && this.syncType == 'initial') {
      const initialSync = await sequelize.models.InitialSyncStatus.findOne({
        where: {
          accountId: this.accountId,
        },
      });

      initialSync[this.dataType] = 'FAILED';
      await initialSync.save();
    }

    if (status == 'COMPLETED' || status === 'PROCESSED') {
      this.completedAt = moment();

      if (this.syncType == 'initial') {
        const initialSync = await sequelize.models.InitialSyncStatus.findOne({
          where: {
            accountId: this.accountId,
          },
        });

        initialSync[this.dataType] = 'COMPLETED';
        await initialSync.save();
      }
    }

    return await this.save();
  };

  return SyncRecord;
};
