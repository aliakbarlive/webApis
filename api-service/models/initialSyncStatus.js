'use strict';

const { Model } = require('sequelize');
const { upperFirst } = require('lodash');

module.exports = (sequelize, DataTypes) => {
  class InitialSyncStatus extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        as: 'account',
      });
    }
  }
  InitialSyncStatus.init(
    {
      accountId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      inventory: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'IN-PROGRESS', 'COMPLETED', 'FAILED'],
        defaultValue: 'PENDING',
      },
      orders: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'IN-PROGRESS', 'COMPLETED', 'FAILED'],
        defaultValue: 'PENDING',
      },
      financialEvents: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'IN-PROGRESS', 'COMPLETED', 'FAILED'],
        defaultValue: 'PENDING',
      },
      products: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'IN-PROGRESS', 'COMPLETED', 'FAILED'],
        defaultValue: 'PENDING',
      },
      reviews: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'IN-PROGRESS', 'COMPLETED', 'FAILED'],
        defaultValue: 'PENDING',
      },
      inboundFBAShipments: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'IN-PROGRESS', 'COMPLETED', 'FAILED'],
        defaultValue: 'PENDING',
      },
      inboundFBAShipmentItems: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'IN-PROGRESS', 'COMPLETED', 'FAILED'],
        defaultValue: 'PENDING',
      },
      advSnapshots: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'IN-PROGRESS', 'COMPLETED', 'FAILED'],
        defaultValue: 'PENDING',
      },
      advPerformanceReport: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'IN-PROGRESS', 'COMPLETED', 'FAILED'],
        defaultValue: 'PENDING',
      },
    },
    {
      sequelize,
      tableName: 'initialSyncStatus',
      modelName: 'InitialSyncStatus',
      scopes: {
        completed: {
          where: {
            inventory: 'COMPLETED',
            orders: 'COMPLETED',
            financialEvents: 'COMPLETED',
            products: 'COMPLETED',
            reviews: 'COMPLETED',
            inboundFBAShipments: 'COMPLETED',
            inboundFBAShipmentItems: 'COMPLETED',
            advSnapshots: 'COMPLETED',
            advPerformanceReport: 'COMPLETED',
          },
        },
      },
    }
  );

  InitialSyncStatus.prototype.isCompleted = function (attribute) {
    return this.changed(attribute) && this[attribute] == 'COMPLETED';
  };

  InitialSyncStatus.prototype.isAllCompleted = function (attribute) {
    const dataTypesStatuses = sequelize.models.SyncRecord.DATA_TYPES.map(
      (dataType) => this[dataType.name]
    );
    return dataTypesStatuses.every((status) => status == 'COMPLETED');
  };

  InitialSyncStatus.afterUpdate(async (initialSyncStatus, options) => {
    const dataTypes = sequelize.models.SyncRecord.DATA_TYPES;
    try {
      const account = await initialSyncStatus.getAccount();
      const completedDataTypes = dataTypes.filter((dataType) =>
        initialSyncStatus.isCompleted(dataType.name)
      );

      for (const dataType of completedDataTypes) {
        await account.sync(dataType.name, dataType.syncType);

        const method = `after${upperFirst(dataType.name)}Completed`;
        if (method in initialSyncStatus)
          await initialSyncStatus[method](account);
      }

      if (initialSyncStatus.isAllCompleted()) {
        await account.sendNotificationToUsers('initialSyncCompleted');
      }
    } catch (error) {
      console.log(error);
    }
  });

  InitialSyncStatus.prototype.afterInventoryCompleted = function (account) {
    return account.sync('products');
  };

  // InitialSyncStatus.prototype.afterProductsCompleted = function (account) {
  //   return account.sync('reviews');
  // };

  return InitialSyncStatus;
};
