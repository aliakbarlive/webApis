'use strict';
const { Model } = require('sequelize');
const AgencyClient = require('./agencyClient');
const User = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Termination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AgencyClient, User }) {
      this.belongsTo(AgencyClient, {
        foreignKey: 'agencyClientId',
        as: 'agencyClient',
      });
      this.belongsTo(User, {
        as: 'accountManager',
        sourceKey: 'userId',
        foreignKey: 'accountManagerId',
      });
      this.belongsTo(User, {
        as: 'seniorAccountManager',
        sourceKey: 'userId',
        foreignKey: 'seniorAccountManagerId',
      });
    }
  }
  Termination.init(
    {
      terminationId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      agencyClientId: {
        type: DataTypes.UUID,
        references: {
          model: AgencyClient,
          key: 'agencyClientId',
        },
      },
      accountManagerId: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      terminationDate: DataTypes.DATE,
      seniorAccountManagerId: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      moreInformation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: 'terminations',
      modelName: 'Termination',
    }
  );
  return Termination;
};
