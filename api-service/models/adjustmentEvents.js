'use strict';
const { Model } = require('sequelize');
const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class AdjustmentEvent extends Model {
    static associate({ Account, AdjustmentItem }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
      this.hasMany(AdjustmentItem, {
        foreignKey: 'adjustmentEventId',
        constraints: false,
      });
    }
  }
  AdjustmentEvent.init(
    {
      adjustmentEventId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      accountId: {
        type: DataTypes.UUID,
        references: {
          model: Account,
          key: 'accountId',
        },
      },
      adjustmentType: DataTypes.STRING,
      postedDate: DataTypes.DATE,
      currencyCode: DataTypes.STRING,
      currencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('currencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'adjustmentEvents',
      modelName: 'AdjustmentEvent',
    }
  );
  return AdjustmentEvent;
};
