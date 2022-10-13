'use strict';
const { Model } = require('sequelize');
const User = require('./user');
module.exports = (sequelize, DataTypes) => {
  class LeadSource extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      // define association here
      User,
    }) {
      this.belongsTo(User, {
        foreignKey: 'uploadedBy',
        as: 'uploadedByUser',
      });
    }
  }
  LeadSource.init(
    {
      leadSourceId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      filename: DataTypes.STRING,
      extension: DataTypes.STRING,
      s3file: DataTypes.STRING,
      totalRows: DataTypes.INTEGER,
      inserted: DataTypes.INTEGER,
      skipped: DataTypes.INTEGER,
      uploadedBy: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'userId',
        },
      },
    },
    {
      sequelize,
      modelName: 'LeadSource',
      tableName: 'leadSources',
    }
  );
  return LeadSource;
};
