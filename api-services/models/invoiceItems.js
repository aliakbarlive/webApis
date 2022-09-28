'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoiceItem extends Model {
    static associate({ Invoice }) {
      this.belongsTo(Invoice, { foreignKey: 'invoiceId' });
    }
  }
  InvoiceItem.init(
    {
      invoiceItemId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      invoiceId: { type: DataTypes.BIGINT, foreignKey: true },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      code: DataTypes.STRING,
      customFields: DataTypes.JSON,
      price: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      discountAmount: DataTypes.FLOAT,
      itemTotal: DataTypes.FLOAT,
      taxId: DataTypes.STRING,
      taxExemptionId: DataTypes.STRING,
      taxExemptionCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'InvoiceItem',
      tableName: 'invoiceItems',
    }
  );
  return InvoiceItem;
};
