'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CreditNote extends Model {
    static associate({ User, AgencyClient, UserGroup }) {
      this.belongsTo(User, { foreignKey: 'requestorId', as: 'requestor' });
      this.belongsTo(User, { foreignKey: 'approvedBy', as: 'approved' });
      this.belongsTo(UserGroup, { foreignKey: 'requestorId', as: 'group' });
      this.belongsTo(AgencyClient, {
        foreignKey: 'customerId',
        targetKey: 'zohoId',
      });
    }
  }
  CreditNote.init(
    {
      creditNoteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      zohoCreditNoteId: {
        type: DataTypes.STRING,
      },
      zohoCreditNoteNumber: {
        type: DataTypes.STRING,
      },
      cellId: {
        type: DataTypes.INTEGER,
      },
      customerId: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.STRING,
      },
      status: DataTypes.ENUM(
        'pending',
        'approved',
        'denied',
        'cancelled',
        'manually-approved'
      ),
      dateApplied: {
        type: DataTypes.DATE,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      terms: {
        type: DataTypes.TEXT,
      },
      requestorId: {
        type: DataTypes.UUID,
      },
      approvedBy: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      tableName: 'creditNotes',
      modelName: 'CreditNote',
    }
  );

  return CreditNote;
};
