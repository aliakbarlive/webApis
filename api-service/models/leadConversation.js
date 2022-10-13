'use strict';
const { Model } = require('sequelize');
const Lead = require('./lead');
const User = require('./user');

module.exports = (sequelize, DataTypes) => {
  class LeadConversation extends Model {
    static associate({ Lead }) {
      this.belongsTo(Lead, {
        foreignKey: 'leadId',
        as: 'lead',
        onDelete: 'CASCADE',
      });
    }
  }
  LeadConversation.init(
    {
      leadConversationId: {
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
      sentFrom: DataTypes.STRING,
      siPlatForm: DataTypes.STRING,
      siPlatFormValue: DataTypes.STRING,
      leadPlatForm: DataTypes.STRING,
      leadPlatFormValue: DataTypes.STRING,
      sentTo: DataTypes.STRING,
      sentToValue: DataTypes.STRING,
      fullMessage: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: 'leadConversation',
      modelName: 'LeadConversation',
    }
  );
  return LeadConversation;
};
