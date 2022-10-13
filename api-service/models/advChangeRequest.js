'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdvChangeRequest extends Model {
    static associate({
      AgencyClient,
      AdvChangeRequestItem,
      AdvOptimizationBatch,
      AdvProfile,
      Account,
      User,
    }) {
      this.hasMany(AdvChangeRequestItem, {
        foreignKey: 'advChangeRequestId',
        as: 'items',
      });

      this.belongsTo(AgencyClient, {
        foreignKey: 'clientId',
        as: 'client',
      });

      this.belongsTo(AdvProfile, {
        foreignKey: 'advProfileId',
        as: 'advProfile',
      });

      this.hasOne(AdvOptimizationBatch, {
        foreignKey: 'advChangeRequestId',
        as: 'optimizationBatch',
      });

      this.belongsTo(User, {
        foreignKey: 'requestedBy',
        as: 'requestor',
      });

      this.belongsTo(User, {
        foreignKey: 'evaluatedBy',
        as: 'evaluator',
      });
    }
  }
  AdvChangeRequest.init(
    {
      advChangeRequestId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      advProfileId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      requestedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      description: {
        type: DataTypes.TEXT,
      },
      evaluatedBy: {
        type: DataTypes.UUID,
      },
      evaluatedAt: {
        type: DataTypes.DATE,
      },
      requestedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'AdvChangeRequest',
      tableName: 'advChangeRequests',
    }
  );
  return AdvChangeRequest;
};
