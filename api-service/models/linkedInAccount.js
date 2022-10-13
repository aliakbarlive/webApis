'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LinkedInAccount extends Model {
    static associate() {}
  }
  LinkedInAccount.init(
    {
      linkedInAccountId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      status: DataTypes.STRING,
      gender: DataTypes.STRING,
      category: DataTypes.STRING,
      counter: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'linkedInAccounts',
      modelName: 'LinkedInAccount',
    }
  );
  return LinkedInAccount;
};
