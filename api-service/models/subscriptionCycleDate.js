'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SubscriptionCycleDate extends Model {
    static associate({ AgencyClient }) {
      this.belongsTo(AgencyClient, { foreignKey: 'agencyClientId' });
    }
  }
  SubscriptionCycleDate.init(
    {
      subscriptionCycleDateId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      agencyClientId: DataTypes.UUID,
      subscriptionStartDate: DataTypes.DATE,
      subscriptionValidUntilDate: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'subscriptionCycleDate',
      modelName: 'SubscriptionCycleDate',
    }
  );

  return SubscriptionCycleDate;
};
