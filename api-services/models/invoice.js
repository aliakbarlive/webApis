'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate({ InvoiceItem }) {
      this.hasMany(InvoiceItem, {
        foreignKey: 'invoiceId',
        constraints: false,
        as: 'invoiceItems',
      });
    }
  }
  Invoice.init(
    {
      invoiceId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      invoiceNumber: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      customerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      invoiceDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      currencyCode: {
        type: DataTypes.STRING,
      },
      currencySymbol: {
        type: DataTypes.STRING,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      writeOffAmount: {
        type: DataTypes.FLOAT,
      },
      creditsApplied: {
        type: DataTypes.FLOAT,
      },
      paymentMade: {
        type: DataTypes.FLOAT,
      },
      details: DataTypes.JSON,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Invoice',
      tableName: 'invoices',
      timestamps: false,
    }
  );
  return Invoice;
};
