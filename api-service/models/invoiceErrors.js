'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoiceError extends Model {
    static associate({ Account }) {
      this.belongsTo(Account, {
        foreignKey: 'accountId',
        as: 'account',
      });
    }
  }
  InvoiceError.init(
    {
      invoiceErrorId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      invoiceId: DataTypes.STRING,
      invoiceNumber: DataTypes.STRING,
      invoiceDate: DataTypes.DATE,
      accountId: {
        type: DataTypes.UUID,
        foreignKey: true,
      },
      status: DataTypes.STRING,
      description: DataTypes.TEXT,
      notifiedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'invoiceErrors',
      modelName: 'InvoiceError',
    }
  );
  return InvoiceError;
};
