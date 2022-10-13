'use strict';
const { Model } = require('sequelize');
const Lead = require('./lead');
const User = require('./user');

module.exports = (sequelize, DataTypes) => {
  class LeadNote extends Model {
    static associate({ Lead, User }) {
      this.belongsTo(Lead, {
        foreignKey: 'leadId',
        as: 'lead',
        onDelete: 'CASCADE',
      });
      this.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });
    }
  }
  LeadNote.init(
    {
      leadNoteId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      leadId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Lead,
          key: 'leadId',
        },
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      addedBy: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
    },
    {
      sequelize,
      tableName: 'leadNotes',
      modelName: 'LeadNote',
    }
  );
  return LeadNote;
};
