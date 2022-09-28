'use strict';
const { Model } = require('sequelize');

const Account = require('./account');

module.exports = (sequelize, DataTypes) => {
  class SAFETReimbursementEvent extends Model {
    static associate({ Account, SAFETReimbursementItem }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        constraints: false,
      });
      this.hasMany(SAFETReimbursementItem, {
        foreignKey: 'safetReimbursementEventId',
        constraints: false,
      });
    }
  }
  SAFETReimbursementEvent.init(
    {
      safetReimbursementEventId: {
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
      postedDate: DataTypes.DATE,
      safetClaimId: DataTypes.STRING,
      reasonCode: DataTypes.STRING,
      reimbursedCurrencyCode: DataTypes.STRING,
      reimbursedCurrencyAmount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          return parseFloat(this.getDataValue('reimbursedCurrencyAmount'));
        },
      },
    },
    {
      sequelize,
      tableName: 'safetReimbursementEvents',
      modelName: 'SAFETReimbursementEvent',
    }
  );
  return SAFETReimbursementEvent;
};
