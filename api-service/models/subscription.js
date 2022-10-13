'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, { foreignKey: 'accountId' });
    }
  }
  Subscription.init(
    {
      subscriptionId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        foreignKey: true,
      },
      salesPersonId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      status: DataTypes.STRING,
      isOffline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      activatedAt: DataTypes.DATE,
      cancelledAt: DataTypes.DATE,
      updateToken: DataTypes.STRING,
      updateTokenExpire: DataTypes.DATE,
      planName: DataTypes.STRING,
      planCode: DataTypes.STRING,
      name: DataTypes.STRING,
      subscriptionNumber: DataTypes.STRING,
      amount: DataTypes.FLOAT,
      subTotal: DataTypes.FLOAT,
      isMeteredBilling: DataTypes.BOOLEAN,
      zohoId: {
        type: DataTypes.STRING,
      },
      currentTermStartsAt: DataTypes.DATE,
      currentTermEndsAt: DataTypes.DATE,
      lastBillingAt: DataTypes.DATE,
      nextBillingAt: DataTypes.DATE,
      expiresAt: DataTypes.DATE,
      pauseDate: DataTypes.DATE,
      resumeDate: DataTypes.DATE,
      autoCollect: DataTypes.BOOLEAN,
      data: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'Subscription',
      tableName: 'subscriptions',
    }
  );
  return Subscription;
};
