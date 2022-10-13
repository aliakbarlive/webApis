'use strict';
const { Model } = require('sequelize');
const AgencyClient = require('./agencyClient');
const User = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Upsell extends Model {
    static associate({ UpsellDetail, User, AgencyClient, UpsellOrder }) {
      this.hasMany(UpsellDetail, { foreignKey: 'upsellId', as: 'details' });
      this.belongsTo(AgencyClient, {
        foreignKey: 'agencyClientId',
        as: 'agencyClient',
      });
      this.belongsTo(User, {
        foreignKey: 'requestedBy',
        as: 'requestedByUser',
      });
      this.belongsTo(User, {
        foreignKey: 'approvedBy',
        as: 'approvedByUser',
      });
      this.belongsTo(User, {
        foreignKey: 'soldBy',
        as: 'soldByUser',
      });
      this.hasOne(UpsellOrder, { foreignKey: 'upsellId', as: 'order' });
    }
  }
  Upsell.init(
    {
      upsellId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      agencyClientId: {
        type: DataTypes.UUID,
        references: {
          model: AgencyClient,
          key: 'agencyClientId',
        },
      },
      requestedBy: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      approvedBy: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      soldBy: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      commissionAmount: DataTypes.FLOAT,
      status: {
        type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'draft',
      },
      approvedAt: DataTypes.DATE,
      invoiceId: DataTypes.STRING,
      invoiceStatus: DataTypes.STRING,
      invoiceNumber: DataTypes.STRING,
      invoiceDate: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'upsells',
      modelName: 'Upsell',
    }
  );
  return Upsell;
};
