'use strict';
const { Model, Op } = require('sequelize');
const AdvAdGroup = require('./advAdGroup');

module.exports = (sequelize, DataTypes) => {
  class AdvProductAd extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdvAdGroup, Product, AdvProductAdRecord }) {
      this.belongsTo(Product, { foreignKey: 'asin', constraints: false });
      this.belongsTo(AdvAdGroup, {
        foreignKey: 'advAdGroupId',
        constraints: false,
      });
      this.hasMany(AdvProductAdRecord, {
        foreignKey: 'advProductAdId',
        as: 'records',
        constraints: false,
      });
    }

    static async bulkSync(records, mainSync = true) {
      return new Promise(async (resolve, reject) => {
        try {
          const attrs = Object.keys(this.rawAttributes);

          records = records
            .filter((r) => r.asin && r.sku)
            .map((record) => {
              Object.keys(record).forEach((key) => {
                if (!attrs.includes(key)) {
                  delete record[key];
                }
              });

              return record;
            });

          records = await this.bulkCreate(records, {
            updateOnDuplicate: mainSync ? attrs : ['sku', 'asin'],
          });

          return resolve(records);
        } catch (error) {
          return reject(error);
        }
      });
    }
  }
  AdvProductAd.init(
    {
      advProductAdId: {
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
      sku: {
        type: DataTypes.STRING,
      },
      asin: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.ENUM('enabled', 'paused', 'archived'),
      },
      servingStatus: {
        type: DataTypes.STRING,
      },
      syncAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      creationDate: DataTypes.BIGINT,
      lastUpdatedDate: DataTypes.BIGINT,
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['asin'],
        },
        {
          unique: false,
          fields: ['sku'],
        },
      ],
      sequelize,
      modelName: 'AdvProductAd',
      tableName: 'advProductAds',
      timestamps: false,
    }
  );
  return AdvProductAd;
};
