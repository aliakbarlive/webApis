'use strict';
const { Model } = require('sequelize');
const AdvAdGroup = require('./advAdGroup');
const _ = require('lodash');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class AdvKeyword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvAdGroup, AdvSearchTerm, AdvKeywordRecord }) {
      this.belongsTo(AdvAdGroup, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });

      this.hasMany(AdvSearchTerm, {
        foreignKey: 'advKeywordId',
        constraints: false,
      });

      this.hasMany(AdvKeywordRecord, {
        foreignKey: 'advKeywordId',
        as: 'records',
        constraints: false,
      });
    }

    static async bulkSync(records, mainSync = true) {
      return new Promise(async (resolve, reject) => {
        try {
          const attrs = Object.keys(this.rawAttributes);
          records = _.uniqBy(records, 'keywordId').map((r) => {
            let obj = Object.assign(r, {
              matchType: r.matchType.toLowerCase(),
            });

            Object.keys(obj).forEach((key) => {
              if (!attrs.includes(key)) {
                delete obj[key];
              }
            });
            return obj;
          });

          records = await this.bulkCreate(records, {
            updateOnDuplicate: mainSync ? attrs : ['keywordText', 'matchType'],
          });

          return resolve(records);
        } catch (error) {
          return reject(error);
        }
      });
    }
  }
  AdvKeyword.init(
    {
      advKeywordId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
      },
      advAdGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: AdvAdGroup,
          key: 'advAdGroupId',
        },
      },
      keywordText: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      bid: DataTypes.DECIMAL,
      matchType: DataTypes.ENUM('exact', 'phrase', 'broad', 'pending'),
      state: DataTypes.ENUM('enabled', 'paused', 'archived'),
      servingStatus: DataTypes.STRING,
      syncAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      bidUpdatedAt: {
        type: DataTypes.DATE,
      },
      bidUpdatedAtInDays: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.bidUpdatedAt
            ? moment().diff(moment(this.bidUpdatedAt), 'days')
            : null;
        },
      },
      creationDate: DataTypes.BIGINT,
      lastUpdatedDate: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'AdvKeyword',
      tableName: 'advKeywords',
      timestamps: false,
    }
  );
  return AdvKeyword;
};
