'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    static associate({ User, Account }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
    }
  }
  Member.init(
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
      roleId: {
        type: DataTypes.INTEGER,
        notNull: true,
        foreignKey: true,
      },
    },
    {
      sequelize,
      tableName: 'members',
      modelName: 'Member',
    }
  );

  return Member;
};
