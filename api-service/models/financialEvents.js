'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FinancialEvent extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, { foreignKey: 'accountId' });
    }
  }
  FinancialEvent.init(
    {
      financialEventId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      accountId: {
        type: DataTypes.UUID,
        foreignKey: true,
        allowNull: false,
      },
      type: DataTypes.STRING,
      data: DataTypes.JSONB,
    },
    {
      sequelize,
      tableName: 'financialEvents',
      modelName: 'FinancialEvent',
    }
  );
  return FinancialEvent;
};
