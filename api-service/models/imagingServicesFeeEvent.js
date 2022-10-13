'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class ImagingServicesFeeEvent extends Model {
    static associate({ Account, ItemFee }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
      this.hasMany(ItemFee, {
        foreignKey: 'imagingServicesFeeEventId',
        constraints: false,
      });
    }
  }
  ImagingServicesFeeEvent.init(
    {
      imagingServicesFeeEventId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Account,
          key: 'accountId',
        },
      },
      imagingRequestBillingItemID: DataTypes.STRING,
      asin: DataTypes.STRING,
      postedDate: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'imagingServicesFeeEvents',
      modelName: 'ImagingServicesFeeEvent',
    }
  );
  return ImagingServicesFeeEvent;
};
