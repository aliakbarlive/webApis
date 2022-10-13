'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate({ ClientChecklist }) {
      this.belongsTo(ClientChecklist, {
        foreignKey: 'referenceId',
        constraints: false,
      });
    }
  }
  Log.init(
    {
      logId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      referenceId: DataTypes.INTEGER,
      logType: DataTypes.STRING,
      name: DataTypes.STRING,
      message: DataTypes.TEXT,
      status: DataTypes.ENUM('success', 'error', 'warning', 'info', 'fatal'),
    },
    {
      sequelize,
      tableName: 'logs',
      modelName: 'Log',
    }
  );

  //Added to prevent duplicate issues during eager loading.
  Log.addHook('afterFind', (findResult) => {
    if (!Array.isArray(findResult)) findResult = [findResult];
    for (const instance of findResult) {
      if (
        instance.logType === 'clientChecklist' &&
        instance.ClientChecklist !== undefined
      ) {
        instance.logTable = instance.ClientChecklist;
      }
      // delete to prevent duplicates
      delete instance.ClientChecklist;
      delete instance.dataValues.ClientChecklist;
    }
  });

  return Log;
};
