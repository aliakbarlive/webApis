'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commission extends Model {
    static associate({ Account, CommissionComputedValue }) {
      this.belongsTo(Account, { foreignKey: 'accountId' });
      this.hasMany(CommissionComputedValue, {
        foreignKey: 'commissionId',
        as: 'commissionComputedValues',
      });
    }
  }
  Commission.init(
    {
      commissionId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      marketplaceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rate: DataTypes.DECIMAL,
      /**
       * type:
       * 1. % of total gross monthly revenue
       * 2. benchmarked trailing monthly average revenue before contract date = total sales from last X months before subscription activated_at / X
       * 3. rolling average (get average of last x cycles) = total sales from last X months / X
       */
      type: {
        type: DataTypes.ENUM,
        values: ['gross', 'benchmark', 'rolling', 'tiered'],
        defaultValue: 'gross',
      },
      monthThreshold: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      preContractAvgBenchmark: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      rules: DataTypes.JSONB,
      managedAsins: DataTypes.JSONB,
      commencedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Commission',
      tableName: 'commissions',
    }
  );
  return Commission;
};
