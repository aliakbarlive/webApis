'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccountEmployee extends Model {
    static associate({ User, Account }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
    }
  }
  AccountEmployee.init(
    {
      userId: {
        type: DataTypes.UUID,
        notNull: true,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        notNull: true,
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: 'accountEmployees',
      modelName: 'AccountEmployee',
    }
  );

  return AccountEmployee;
};
