'use strict';
const { Model } = require('sequelize');
const { upperFirst } = require('lodash');

module.exports = (sequelize, DataTypes) => {
  class Credential extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
    }
  }
  Credential.init(
    {
      credentialId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      service: {
        type: DataTypes.ENUM,
        values: ['spApi', 'advApi'],
        allowNull: false,
      },
      oAuthCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accessToken: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      accessTokenExpire: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Credential',
      tableName: 'credentials',
      scopes: {
        spApi: {
          where: {
            service: 'spApi',
          },
        },
        advApi: {
          where: {
            service: 'advApi',
          },
        },
      },
    }
  );

  Credential.afterCreate(async (credential, options) => {
    try {
      const account = await credential.getAccount();

      const hookMethod = `after${upperFirst(credential.service)}Authorized`;

      if (hookMethod in account) await account[hookMethod]();
    } catch (err) {
      console.log('Error on credential after create hook.', err.message);
    }
  });

  return Credential;
};
